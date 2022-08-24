import { User } from "@src/models/user";
import AuthService from "@src/services/auth";
import distanciaJson from "@test/fixtures/resposta_distancia_service.json";

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

  let token: string;
  beforeEach(async () => {
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  it("deve retonar a distancia entre as cidades", async () => {
    const { body, status } = await global.testRequest
      .post("/distancia")
      .set({ "x-acess-token": token })
      .send({
        ibge_origem: "3516200TEST",
        ibge_destino: "3513207",
      });
    // pega o valor retornado pela API
    expect(status).toBe(200);
    // o retorno tem que ser 200
    expect(body).toEqual(distanciaJson);
    // o corpo tem que bater com a api esperada
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
