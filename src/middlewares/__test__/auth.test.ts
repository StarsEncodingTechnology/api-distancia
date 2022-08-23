import AuthService from "@src/services/auth";
import { authMiddleware } from "../auth";

describe("AuthMiddleware", () => {
  it("deve verificar o JWT e chama o next", () => {
    const jwtToken = AuthService.generateToken({ data: "fake" });

    const reqFake = {
      headers: {
        "x-acess-token": jwtToken,
      },
    };

    const resFake = {};
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake, nextFake);

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
    authMiddleware(reqFake, resFake as Object, nextFake);
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
    authMiddleware(reqFake, resFake as Object, nextFake);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: "jwt must be provided",
    });
  });
});
