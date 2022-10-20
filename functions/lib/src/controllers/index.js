"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const logger_1 = __importDefault(require("@src/logger"));
const user_1 = require("@src/models/user");
const api_error_1 = __importDefault(require("@src/util/errors/api-error"));
const mongoose_1 = __importDefault(require("mongoose"));
class BaseController {
    sendCreateUpdateErrorResponse(res, error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            const clientErrors = this.handleClientErrors(error);
            res
                .status(clientErrors.code)
                .send(api_error_1.default.format({ code: clientErrors.code, message: clientErrors.error }));
        }
        else {
            logger_1.default.error(error);
            res
                .status(500)
                .send(api_error_1.default.format({ code: 500, message: "Something went wrong!" }));
        }
    }
    handleClientErrors(error) {
        const duplicatedKindErrors = Object.values(error.errors).filter((err) => err.name === "ValidatorError" &&
            err.kind === user_1.CUSTOM_VALIDATION.DUPLICATED);
        if (duplicatedKindErrors.length) {
            return { code: 409, error: error.message };
        }
        return { code: 422, error: error.message };
    }
    SendErrorResponse(res, apiError) {
        return res.status(apiError.code).send(api_error_1.default.format(apiError));
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=index.js.map