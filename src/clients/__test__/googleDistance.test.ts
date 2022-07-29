import { GoogleDistance } from "../googleDistance";
import respostaEsperado from "@test/fixtures/resposta_distancia.json"

describe("GoogleDistance client", () => {
    it("deve retornar os dados normalizados vindo da api do google", async () => {
        const origem = {
            cidade: "franca",
            uf: "sp"
        };
        const destino = {
            cidade: "cristais paulista",
            uf: "sp"
        };


        const googleDistance = new GoogleDistance();
        const response = googleDistance.buscaDistancia(origem, destino)
        console
        expect(response).toEqual({})

        
    })
});
