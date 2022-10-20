"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const axios_1 = __importDefault(require("axios"));
class Request {
    request;
    constructor(request = axios_1.default) {
        this.request = request;
    }
    get(url, config = {}) {
        return this.request.get(url, config);
    }
    static isRequestError(error) {
        return !!((error.response && error.response?.status));
    }
    static extractErrorData(error) {
        const axiosError = error;
        if (axiosError.response && axiosError.response.status) {
            return {
                data: axiosError.response.data,
                status: axiosError.response.status,
            };
        }
        throw Error(`The error ${error} is not a Request Error`);
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map