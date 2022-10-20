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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDistance = exports.apiNegadaError = exports.apiInesperadoError = exports.GenericoClientError = exports.DistanciaVaziaError = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + "../../.env" });
const internal_error_1 = require("@src/util/errors/internal-error");
const HTTPUtil = __importStar(require("@src/util/request"));
class DistanciaVaziaError extends internal_error_1.InternalError {
    constructor(error) {
        const internalMessage = "Erro a API não retornou uma distancia: ";
        super(`${internalMessage}: ${error}`);
    }
}
exports.DistanciaVaziaError = DistanciaVaziaError;
class GenericoClientError extends internal_error_1.InternalError {
    constructor(error) {
        const internalMessage = "Erro generico do client: ";
        super(`${internalMessage} ${error}`);
    }
}
exports.GenericoClientError = GenericoClientError;
class apiInesperadoError extends internal_error_1.InternalError {
    constructor(message) {
        const internalError = "algum erro inesperado da googleMatrix: ";
        super(`${internalError} ${message}`);
    }
}
exports.apiInesperadoError = apiInesperadoError;
class apiNegadaError extends internal_error_1.InternalError {
    constructor(message) {
        const internalError = "Erro a api retornou: ";
        super(`${internalError} ${message}`);
    }
}
exports.apiNegadaError = apiNegadaError;
class GoogleDistance {
    request;
    constructor(request = new HTTPUtil.Request()) {
        this.request = request;
    }
    async buscaDistancia(origem, destino) {
        const variavelDestino = (destino.cidade + "-" + destino.uf).replaceAll(" ", "+");
        const variavelOrigem = (origem.cidade + "-" + origem.uf).replaceAll(" ", "+");
        const url = this.retiraCaracteresEspeciais(`${process.env.googleDistancematrix}json?origins=${variavelOrigem}&destinations=${variavelDestino}&key=${process.env.APITOKEN}`);
        try {
            const response = await this.request.get(`${url}`, {
                headers: {},
            });
            if (!!response.data.rows[0]?.elements[0]?.distance?.text) {
                return this.normalizaComDados(response.data, destino, origem);
            }
            else if (!!response.data.status.includes("REQUEST_DENIED")) {
                throw new apiNegadaError("REQUEST_DENIED");
            }
            else {
                throw new DistanciaVaziaError("Distancia vazia");
            }
        }
        catch (error) {
            if (error instanceof Error && HTTPUtil.Request.isRequestError(error)) {
                const err = HTTPUtil.Request.extractErrorData(error);
                throw new apiInesperadoError(`Error: ${JSON.stringify(err.data)} Code: ${err.status}`);
            }
            throw new GenericoClientError(JSON.stringify(error));
        }
    }
    normalizaComDados(distancia, destino, origem) {
        const valorDistance = distancia.rows[0].elements.find((element) => !!element.distance.text)?.distance.text;
        const valorDistanciaNumber = Number.parseFloat(valorDistance?.replace(",", "")?.split(" ")[0]);
        return {
            destino: {
                cidade: destino.cidade.toUpperCase(),
                uf: destino.uf.toUpperCase(),
            },
            origem: {
                cidade: origem.cidade.toUpperCase(),
                uf: origem.uf.toUpperCase(),
            },
            distancia: valorDistanciaNumber,
        };
    }
    retiraCaracteresEspeciais(text) {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
exports.GoogleDistance = GoogleDistance;
//# sourceMappingURL=googleDistance.js.map