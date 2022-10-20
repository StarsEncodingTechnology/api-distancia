"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleDistance_1 = require("../googleDistance");
const resposta_distancia_client_json_1 = __importDefault(require("@test/fixtures/resposta_distancia_client.json"));
const HTTPUtil = __importStar(require("@src/util/request"));
const resposta_API_google_distance_matrix_json_1 = __importDefault(require("@test/fixtures/resposta_API_google_distance_matrix.json"));
const respostaSemResultado_google_matrix_json_1 = __importDefault(require("@test/fixtures/respostaSemResultado_google_matrix.json"));
jest.mock("@src/util/request");
describe("GoogleDistance client", () => {
    const MockedRequestClass = HTTPUtil.Request;
    const mockedRequest = new HTTPUtil.Request();
    it("deve retornar os dados normalizados vindo da api do google", async () => {
        const origem = {
            cidade: "Franca",
            uf: "SP",
        };
        const destino = {
            cidade: "Cristais Paulista",
            uf: "SP",
        };
        mockedRequest.get.mockResolvedValue({
            data: resposta_API_google_distance_matrix_json_1.default,
        });
        const googleDistance = new googleDistance_1.GoogleDistance(mockedRequest);
        const response = await googleDistance.buscaDistancia(origem, destino);
        expect(response).toEqual(resposta_distancia_client_json_1.default);
    });
    it("deve retornar sem distancia", async () => {
        const origem = {
            cidade: "Franca",
            uf: "SP",
        };
        const destino = {
            cidade: "Cristais Paulista",
            uf: "SP",
        };
        mockedRequest.get.mockResolvedValue({
            data: respostaSemResultado_google_matrix_json_1.default,
        });
        const googleDistance = new googleDistance_1.GoogleDistance(mockedRequest);
        await expect(googleDistance.buscaDistancia(origem, destino)).rejects.toThrow('Erro generico do client:  {"message":"Erro a API não retornou uma distancia: : Distancia vazia","code":500,"name":"DistanciaVaziaError"}');
    });
    it("deve retornar um erro se a api não responder", async () => {
        const origem = {
            cidade: "Franca",
            uf: "SP",
        };
        const destino = {
            cidade: "Cristais Paulista",
            uf: "SP",
        };
        mockedRequest.get.mockRejectedValue({ message: "Network error" });
        const googleDistance = new googleDistance_1.GoogleDistance(mockedRequest);
        await expect(googleDistance.buscaDistancia(origem, destino)).rejects.toThrow('Erro generico do client:  {"message":"Network error"}');
    });
    it("deve retornar um a api retornar um error", async () => {
        const origem = {
            cidade: "Franca",
            uf: "SP",
        };
        const destino = {
            cidade: "Cristais Paulista",
            uf: "SP",
        };
        MockedRequestClass.isRequestError.mockReturnValue(true);
        mockedRequest.get.mockRejectedValue({
            response: {
                status: 200,
                data: {
                    destination_addresses: [],
                    error_message: "The provided API key is invalid. ",
                    origin_addresses: [],
                    rows: [],
                    status: "REQUEST_DENIED",
                },
            },
        });
        const googleDistance = new googleDistance_1.GoogleDistance(mockedRequest);
        await expect(googleDistance.buscaDistancia(origem, destino)).rejects.toThrow('Erro generico do client:  {"response":{"status":200,"data":{"destination_addresses":[],"error_message":"The provided API key is invalid. ","origin_addresses":[],"rows":[],"status":"REQUEST_DENIED"}}}');
    });
});
//# sourceMappingURL=googleDistance.test.js.map