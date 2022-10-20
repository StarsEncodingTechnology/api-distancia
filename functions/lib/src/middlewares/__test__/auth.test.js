"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("@src/services/auth"));
const auth_2 = require("../auth");
describe("AuthMiddleware", () => {
    it("deve verificar o JWT e chama o next", () => {
        const jwtToken = auth_1.default.generateToken({ data: "fake" });
        const reqFake = {
            headers: {
                "x-acess-token": jwtToken,
            },
        };
        const resFake = {};
        const nextFake = jest.fn();
        (0, auth_2.authMiddleware)(reqFake, resFake, nextFake);
        expect(nextFake).toHaveBeenCalled();
    });
    it("deve retornar não autorizado se houver problema com o token", () => {
        const reqFake = {
            headers: {
                "x-acess-token": "invalid token",
            },
        };
        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        };
        const nextFake = jest.fn();
        (0, auth_2.authMiddleware)(reqFake, resFake, nextFake);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: "jwt malformed",
        });
    });
    it("deve retornar não autorizado se houver problema com o token", () => {
        const reqFake = {
            headers: {},
        };
        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        };
        const nextFake = jest.fn();
        (0, auth_2.authMiddleware)(reqFake, resFake, nextFake);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: "jwt must be provided",
        });
    });
});
//# sourceMappingURL=auth.test.js.map