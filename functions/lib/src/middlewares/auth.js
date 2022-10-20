"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = __importDefault(require("@src/services/auth"));
function authMiddleware(req, res, next) {
    const token = req.headers?.['x-acess-token'];
    try {
        const decoded = auth_1.default.decodeToken(token);
        req.decoded = decoded;
        next();
    }
    catch (err) {
        res.status?.(401).send({
            code: 401, error: err.message
        });
    }
}
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map