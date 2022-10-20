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
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + "../../../.env" });
const resposta_distancia_service_json_1 = __importDefault(require("@test/fixtures/resposta_distancia_service.json"));
const googleDistance_1 = require("@src/clients/googleDistance");
const resposta_distancia_client_json_1 = __importDefault(require("@test/fixtures/resposta_distancia_client.json"));
const calculoDistancia_1 = require("../calculoDistancia");
const dataBase = __importStar(require("@src/database"));
jest.mock("@src/clients/googleDistance");
describe("Teste em calculoDistancia Services", () => {
    beforeAll(async () => {
        await dataBase.connect();
    });
    afterAll(async () => {
        await dataBase.close();
    });
    const mockedGoogleDistanciaClient = new googleDistance_1.GoogleDistance();
    it("Deve retornar o valor correto COM dados no DB", async () => {
        mockedGoogleDistanciaClient.buscaDistancia.mockResolvedValue(resposta_distancia_client_json_1.default);
        const cidadeOrigem = {
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
        const cidadeDestino = {
            UF: "SP",
            nome_UF: "SÃO PAULO",
            municipio: "13207",
            codigo_municipio_completo: "3513207",
            nome_municipio: "CRISTAIS PAULISTA",
            codigo_UF: "35",
            distancia: {},
        };
        const distanciaDados = new calculoDistancia_1.DistanciaDados(mockedGoogleDistanciaClient);
        const distanciaProcessada = await distanciaDados.processandoDadosCidades(cidadeOrigem, cidadeDestino);
        expect(distanciaProcessada).toEqual(resposta_distancia_service_json_1.default);
    });
    it("Deve retornar o valor correto do service SEM dados no DB", async () => {
        mockedGoogleDistanciaClient.buscaDistancia.mockResolvedValue(resposta_distancia_client_json_1.default);
        const cidadeOrigem = {
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
        cidadeOrigem.distancia = undefined;
        const cidadeDestino = {
            UF: "SP",
            nome_UF: "SÃO PAULO",
            municipio: "13207",
            codigo_municipio_completo: "3513207",
            nome_municipio: "CRISTAIS PAULISTA",
            codigo_UF: "35",
        };
        const distanciaDados = new calculoDistancia_1.DistanciaDados(mockedGoogleDistanciaClient);
        const distanciaProcessada = await distanciaDados.processandoDadosCidades(cidadeOrigem, cidadeDestino);
        expect(distanciaProcessada).toEqual(resposta_distancia_service_json_1.default);
    });
    it("deve lançar um erro de processo interno, quando algo da errado durante o processo", async () => {
        const cidadeOrigem = {
            UF: "SP",
            nome_UF: "SÃO PAULO",
            municipio: "16200",
            codigo_municipio_completo: "3516200",
            nome_municipio: "FRANCA",
            codigo_UF: "35",
        };
        const cidadeDestino = {
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
        const distanciaDados = new calculoDistancia_1.DistanciaDados(mockedGoogleDistanciaClient);
        await expect(distanciaDados.processandoDadosCidades(cidadeOrigem, cidadeDestino)).rejects.toThrow(calculoDistancia_1.CalculoDistanciaInternoErro);
    });
});
//# sourceMappingURL=calculoDistancia.test.js.map