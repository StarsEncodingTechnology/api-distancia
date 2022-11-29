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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanciaController = void 0;
const core_1 = require("@overnightjs/core");
const auth_1 = require("@src/middlewares/auth");
const cidade_1 = require("@src/models/cidade");
const calculoDistancia_1 = require("@src/services/calculoDistancia");
const consumo_1 = require("@src/services/consumo");
const _1 = require(".");
const distanciaDados = new calculoDistancia_1.DistanciaDados();
let DistanciaController = class DistanciaController extends _1.BaseController {
    async pegaDistanciaUsuarioLogado(req, res) {
        const ibgeOrigem = req.body.ibge_origem;
        const ibgeDestino = req.body.ibge_destino;
        if (!ibgeOrigem || !ibgeDestino) {
            res.status(400).send({
                code: 400,
                message: "ibge_origem or ibge_destino Not Found",
            });
        }
        else {
            try {
                const dadosOrigem = await cidade_1.Cidade.findOne({
                    codigo_municipio_completo: ibgeOrigem,
                });
                const dadosDestino = await cidade_1.Cidade.findOne({
                    codigo_municipio_completo: ibgeDestino,
                });
                if (dadosOrigem != null && dadosDestino != null) {
                    const result = await distanciaDados.processandoDadosCidades(dadosOrigem, dadosDestino);
                    res.status(200).send(result);
                }
                else {
                    res.status(400).send({
                        code: 400,
                        message: "ibge_origem or ibge_destino Invalid",
                    });
                }
                await consumo_1.AtualizaConsumo.adicionaUmConsumo(req);
            }
            catch (error) {
                this.sendCreateUpdateErrorResponse(res, error);
            }
        }
    }
};
__decorate([
    (0, core_1.Post)(""),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DistanciaController.prototype, "pegaDistanciaUsuarioLogado", null);
DistanciaController = __decorate([
    (0, core_1.Controller)("distancia"),
    (0, core_1.ClassMiddleware)(auth_1.authMiddleware)
], DistanciaController);
exports.DistanciaController = DistanciaController;
//# sourceMappingURL=distancia.js.map