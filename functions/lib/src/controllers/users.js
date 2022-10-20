"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const core_1 = require("@overnightjs/core");
const user_1 = require("@src/models/user");
const auth_1 = __importDefault(require("@src/services/auth"));
const dataAtual_1 = require("@src/util/dataAtual");
const api_error_1 = __importDefault(require("@src/util/errors/api-error"));
const express_rate_limit_1 = require("express-rate-limit");
const _1 = require(".");
const rateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1 * 60 * 1000,
    max: 15,
    keyGenerator(req) {
        return req.ip;
    },
    handler(_, res) {
        res
            .status(429)
            .send(api_error_1.default.format({
            code: 429,
            message: "Limite de 15 requisições atingido",
        }));
    },
});
let UsersController = class UsersController extends _1.BaseController {
    async create(req, res) {
        try {
            const dataAtual = new dataAtual_1.DataAtual();
            const consumo = {
                consumo: {
                    [dataAtual.mesAtual() + dataAtual.anoAtual()]: {
                        [dataAtual.diaAtual()]: 0,
                    },
                },
            };
            const userInfo = { ...req.body, ...consumo };
            const user = new user_1.User(userInfo);
            const newUser = await user.save();
            res.status(201).send(newUser);
        }
        catch (error) {
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }
    async authenticate(req, res) {
        const { email, password } = req.body;
        const user = await user_1.User.findOne({ email: email });
        if (!user) {
            return this.SendErrorResponse(res, {
                code: 401,
                message: "User not found!",
            });
        }
        if (!(await auth_1.default.comparePassword(password, user.password))) {
            return this.SendErrorResponse(res, {
                code: 401,
                message: "Password does not match!",
            });
        }
        const token = auth_1.default.generateToken(user.toJSON());
        return res.status(200).send({ ...user.toJSON(), ...{ token } });
    }
};
__decorate([
    (0, core_1.Post)(""),
    (0, core_1.Middleware)(rateLimiter),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, core_1.Post)("authenticate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "authenticate", null);
UsersController = __decorate([
    (0, core_1.Controller)("users")
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.js.map