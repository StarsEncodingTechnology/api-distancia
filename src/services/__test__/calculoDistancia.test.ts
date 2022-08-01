import respostaCorretaService from "@test/fixtures/resposta_distancia_service.json";
import { GoogleDistance } from "@src/clients/googleDistance";
import googleDistanciaRespostaNormalizada from "@test/fixtures/resposta_distancia_client.json";
import { DistanciaDados } from "../calculoDistancia";
import { Cidade } from "@src/models/cidade";


jest.mock("@src/clients/googleDistance");

describe("Teste em calculoDistancia Services", () => {
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
      codigo_municipio_completo: "3516200",
      nome_municipio: "FRANCA",
      codigo_UF: "35",
      distancia: {
        "3513207": {
          cidade: "CRISTAIS PAULISTA",
          UF: "SP",
          distancia: 21
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
      distancia: {}
    }

    const distanciaDados = new DistanciaDados(mockedGoogleDistanciaClient);
    const distanciaProcessada = await distanciaDados.processandoDadosCidades(cidadeOrigem, cidadeDestino)

    expect(distanciaProcessada).toEqual(respostaCorretaService)
  });

  it.only("Deve retornar o valor correto do service SEM dados no DB", async () => {
    mockedGoogleDistanciaClient.buscaDistancia.mockResolvedValue(
      googleDistanciaRespostaNormalizada
    );
    
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
    }

    const distanciaDados = new DistanciaDados(mockedGoogleDistanciaClient);
    const distanciaProcessada = await distanciaDados.processandoDadosCidades(cidadeOrigem, cidadeDestino)

    expect(distanciaProcessada).toEqual(respostaCorretaService)
  });
});
