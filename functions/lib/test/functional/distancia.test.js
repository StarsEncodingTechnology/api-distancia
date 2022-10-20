"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("@src/models/user");
const auth_1 = __importDefault(require("@src/services/auth"));
const resposta_distancia_service_json_1 = __importDefault(require("@test/fixtures/resposta_distancia_service.json"));
describe("Distancia entre cidades teste funcional", () => {
    const defaultUser = {
        name: "John doe",
        email: "testeTESTE@testeTESTE.com",
        password: "1234",
        consumo: [
            {
                "012022": {
                    "01": 0,
                },
            },
        ],
    };
    let token;
    beforeEach(async () => {
        await user_1.User.findOneAndDelete({ email: "testeTESTE@testeTESTE.com" });
        const user = await new user_1.User(defaultUser).save();
        token = auth_1.default.generateToken(user.toJSON());
    });
    afterAll(async () => {
        await user_1.User.findOneAndDelete({ email: "testeTESTE@testeTESTE.com" });
    });
    it("deve retonar a distancia entre as cidades", async () => {
        const { body, status } = await global.testRequest
            .post("/distancia")
            .set({ "x-acess-token": token })
            .send({
            ibge_origem: "3516200TEST",
            ibge_destino: "3513207",
        });
        expect(status).toBe(200);
        expect(body).toEqual(resposta_distancia_service_json_1.default);
    });
    it("deve retornar um erro 400 por informação ibge invalida", async () => {
        const { body, status } = await global.testRequest
            .post("/distancia")
            .set({ "x-acess-token": token })
            .send({
            ibge_origem: "3516200TESTE",
            ibge_destino: "21349",
        });
        expect(status).toBe(400);
        expect(body).toEqual({
            code: 400,
            message: "ibge_origem or ibge_destino Invalid",
        });
    });
    it("deve retornar um erro 400 por falta da informação do ibge", async () => {
        const { body, status } = await global.testRequest
            .post("/distancia")
            .set({ "x-acess-token": token })
            .send({
            ibge_origem: "3516200TEST",
        });
        expect(status).toBe(400);
        expect(body).toEqual({
            code: 400,
            message: "ibge_origem or ibge_destino Not Found",
        });
    });
});
//# sourceMappingURL=distancia.test.js.map