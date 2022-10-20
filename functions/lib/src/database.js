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
exports.close = exports.connect = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: "/.env" });
const mongoose_1 = require("mongoose");
const logger_1 = __importDefault(require("./logger"));
const connect = async (urlDB = process.env.MONGOURL) => {
    const linkDB = urlDB
        .replace("LOGIN_DB", process.env.LOGIN_DB)
        .replace("SENHA_DB", process.env.SENHA_DB)
        .replace("CONFIG_DB", process.env.CONFIG_DB);
    await (0, mongoose_1.connect)(linkDB);
    logger_1.default.info("Conectado");
};
exports.connect = connect;
const close = () => mongoose_1.connection.close();
exports.close = close;
//# sourceMappingURL=database.js.map