import respostaCorretaService from "@test/fixtures/resposta_distancia_service.json";
import { GoogleDistance } from "@src/clients/googleDistance";
import googleDistanciaRespostaNormalizada from "@test/fixtures/resposta_distancia_client.json";

jest.mock("@src/clients/googleDistance")

describe("Teste em calculoDistancia Services", () => {
    const mockedGoogleDistanciaClient = new GoogleDistance() as jest.Mocked<GoogleDistance>;

    it("Deve retornar o valor correto do service", async () => {
        mockedGoogleDistanciaClient.buscaDistancia.mockResolvedValue(
            googleDistanciaRespostaNormalizada
        );

        

    })
})