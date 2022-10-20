"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanciaDados = exports.CalculoDistanciaInternoErro = void 0;
const googleDistance_1 = require("@src/clients/googleDistance");
const logger_1 = __importDefault(require("@src/logger"));
const cidade_1 = require("@src/models/cidade");
const internal_error_1 = require("@src/util/errors/internal-error");
class CalculoDistanciaInternoErro extends internal_error_1.InternalError {
    constructor(message) {
        super(`Erro inesperado durante o processamento de calculoDistanciaInterno: ${message}`);
    }
}
exports.CalculoDistanciaInternoErro = CalculoDistanciaInternoErro;
class DistanciaDados {
    googleDistance;
    constructor(googleDistance = new googleDistance_1.GoogleDistance()) {
        this.googleDistance = googleDistance;
    }
    async processandoDadosCidades(cidadeOrigem, cidadeDestino) {
        try {
            if (!!(!cidadeOrigem.distancia?.[cidadeDestino.codigo_municipio_completo])) {
                const responseGoogle = await this.googleDistance.buscaDistancia({ cidade: cidadeOrigem.nome_municipio, uf: cidadeOrigem.UF }, { cidade: cidadeDestino.nome_municipio, uf: cidadeDestino.UF });
                !cidadeOrigem.distancia ? (cidadeOrigem["distancia"] = {}) : "";
                cidadeOrigem.distancia[`${cidadeDestino.codigo_municipio_completo}`] = {
                    cidade: responseGoogle.destino.cidade,
                    UF: responseGoogle.destino.uf,
                    distancia: responseGoogle.distancia,
                };
                this.updateInfoBanco(cidadeOrigem);
            }
            return this.normalizaDados(cidadeOrigem, cidadeDestino);
        }
        catch (error) {
            logger_1.default.error(error);
            throw new CalculoDistanciaInternoErro(error.message);
        }
    }
    normalizaDados(origem, destino) {
        return {
            origem: {
                nome_municipio: origem.nome_municipio,
                UF: origem.UF,
                nome_UF: origem.nome_UF,
                codigo_UF: origem.codigo_UF,
                codigo_municipio_completo: origem.codigo_municipio_completo,
            },
            destino: {
                nome_municipio: destino.nome_municipio,
                UF: destino.UF,
                nome_UF: destino.nome_UF,
                codigo_UF: destino.codigo_UF,
                codigo_municipio_completo: destino.codigo_municipio_completo,
            },
            distancia: origem.distancia?.[destino.codigo_municipio_completo]
                .distancia,
        };
    }
    async updateInfoBanco(origem) {
        const findOne = {
            codigo_municipio_completo: origem.codigo_municipio_completo,
        };
        const update = { distancia: origem.distancia };
        await cidade_1.Cidade.findOneAndUpdate(findOne, update);
    }
}
exports.DistanciaDados = DistanciaDados;
//# sourceMappingURL=calculoDistancia.js.map