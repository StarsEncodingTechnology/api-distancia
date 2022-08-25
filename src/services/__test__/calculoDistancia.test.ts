import respostaCorretaService from "@test/fixtures/resposta_distancia_service.json";
import { GoogleDistance } from "@src/clients/googleDistance";
import googleDistanciaRespostaNormalizada from "@test/fixtures/resposta_distancia_client.json";

import {
  CalculoDistanciaInternoErro,
  DistanciaDados,
} from "../calculoDistancia";

import * as dataBase from "@src/database";

import { Cidade } from "@src/models/cidade";
import  config  from "config";

jest.mock("@src/clients/googleDistance");

describe("Teste em calculoDistancia Services", () => {
  beforeAll(async () => {
    await dataBase.connect(config.get("App.database.mongoUrl"));
  });

  afterAll(async () => {
    await dataBase.close();
  });

  const mockedGoogleDistanciaClient =
    new GoogleDistance() as jest.Mocked<GoogleDistance>;

  it("Deve retornar o valor correto COM dados no DB", async () => {
    mockedGoogleDistanciaClient.buscaDistancia.mockResolvedValue(
      googleDistanciaRespostaNormalizada
    );

    const cidadeOrigem: Cidade = {
      UF: "SP",
      nome_UF: "SÃO PAULO",
      municipio: "16200",
      codigo_municipio_completo: "3516200TEST",
      nome_municipio: "FRANCA",
      codigo_UF: "35",
      distancia: {
        "3513207": {
          cidade: "CRISTAIS PAULISTA",
          UF: "SP",
          distancia: 21,
        },
      },
    };

    const cidadeDestino: Cidade = {
      UF: "SP",
      nome_UF: "SÃO PAULO",
      municipio: "13207",
      codigo_municipio_completo: "3513207",
      nome_municipio: "CRISTAIS PAULISTA",
      codigo_UF: "35",
      distancia: {},
    };

    const distanciaDados = new DistanciaDados(mockedGoogleDistanciaClient);
    const distanciaProcessada = await distanciaDados.processandoDadosCidades(
      cidadeOrigem,
      cidadeDestino
    );

    expect(distanciaProcessada).toEqual(respostaCorretaService);
  });

  it("Deve retornar o valor correto do service SEM dados no DB", async () => {
    mockedGoogleDistanciaClient.buscaDistancia.mockResolvedValue(
      googleDistanciaRespostaNormalizada
    );

    let cidadeOrigem: Cidade = (await Cidade.findOne({
      codigo_municipio_completo: "3516200TEST",
    })) as Cidade;

    cidadeOrigem.distancia = undefined;
    // delete não funcionou

    const cidadeDestino: Cidade = {
      UF: "SP",
      nome_UF: "SÃO PAULO",
      municipio: "13207",
      codigo_municipio_completo: "3513207",
      nome_municipio: "CRISTAIS PAULISTA",
      codigo_UF: "35",
    };

    const distanciaDados = new DistanciaDados(mockedGoogleDistanciaClient);
    const distanciaProcessada = await distanciaDados.processandoDadosCidades(
      cidadeOrigem,
      cidadeDestino
    );

    expect(distanciaProcessada).toEqual(respostaCorretaService);
  });

  it("deve lançar um erro de processo interno, quando algo da errado durante o processo", async () => {
    const cidadeOrigem: Cidade = {
      UF: "SP",
      nome_UF: "SÃO PAULO",
      municipio: "16200",
      codigo_municipio_completo: "3516200",
      nome_municipio: "FRANCA",
      codigo_UF: "35",
    };

    const cidadeDestino: Cidade = {
      UF: "SP",
      nome_UF: "SÃO PAULO",
      municipio: "13207",
      codigo_municipio_completo: "3513207",
      nome_municipio: "CRISTAIS PAULISTA",
      codigo_UF: "35",
    };

    mockedGoogleDistanciaClient.buscaDistancia.mockRejectedValue({
      message: "Error interno buscaDistancia",
    });

    const distanciaDados = new DistanciaDados(mockedGoogleDistanciaClient);

    await expect(
      distanciaDados.processandoDadosCidades(cidadeOrigem, cidadeDestino)
    ).rejects.toThrow(CalculoDistanciaInternoErro);
  });
});
