"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class ApiError {
    static format(error) {
        return {
            ...{
                message: error.message,
                code: error.code,
                error: error.codeAsString
                    ? error.codeAsString
                    : http_status_codes_1.default.getStatusText(error.code),
            },
            ...(error.documentation && { documentation: error.documentation }),
            ...(error.description && { documentation: error.description }),
        };
    }
}
exports.default = ApiError;
//# sourceMappingURL=api-error.js.map