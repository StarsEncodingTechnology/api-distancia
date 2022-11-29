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
exports.SetupServer = void 0;
require("./util/module-alias");
const core_1 = require("@overnightjs/core");
const body_parser_1 = __importDefault(require("body-parser"));
const distancia_1 = require("./controllers/distancia");
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
const database = __importStar(require("@src/database"));
const users_1 = require("./controllers/users");
const logger_1 = __importDefault(require("./logger"));
const cors_1 = __importDefault(require("cors"));
class SetupServer extends core_1.Server {
    port;
    constructor(port = "3050") {
        super();
        this.port = port;
    }
    async init() {
        this.setupExpress();
        this.setupControllers();
        await this.dataBaseSetup();
    }
    setupExpress() {
        this.app.use(body_parser_1.default.json());
        this.app.use((0, express_pino_logger_1.default)({ logger: logger_1.default }));
        this.app.use((0, cors_1.default)({
            origin: "*",
        }));
    }
    setupControllers() {
        const distanciaController = new distancia_1.DistanciaController();
        const usersController = new users_1.UsersController();
        this.addControllers([distanciaController, usersController]);
    }
    async dataBaseSetup() {
        await database.connect();
    }
    async close() {
        await database.close();
    }
    get getApp() {
        return this.app;
    }
    start() {
        this.app.listen(this.port, () => {
            logger_1.default.info("Server rodando em: " + this.port);
        });
    }
}
exports.SetupServer = SetupServer;
//# sourceMappingURL=server.js.map