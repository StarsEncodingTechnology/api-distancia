import { User } from "@src/models/user";
import AuthService from "@src/services/auth";

describe("Testes funcionais do Users", () => {
  describe("Quando criar um novo usuario", () => {
    it("deve criar um novo usuario com sucesso com senha criptografada", async () => {
      const newUser = {
        name: "John doe",
        email: "testeTESTE@testeTESTE.com",
        password: "1234",
      };

      await User.findOneAndDelete({ email: newUser.email });

      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePassword(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });
  });

  it("deve retorno um erro 422 quando faltar alguma informação", async () => {
    const newUser = {
      name: "John doe",
      password: "1234",
    };

    const response = await global.testRequest.post("/users").send(newUser);

    expect(response.status).toBe(422);

    expect(response.body).toEqual({
      code: 422,
      error: "Unprocessable Entity",
      message: "User validation failed: email: Path `email` is required."
    });
  });

  it("deve retorno um erro 409 quando o email já estiver em uso", async () => {
    const newUser = {
      name: "John doe",
      email: "testeTESTE@testeTESTE.com",
      password: "1234",
    };

    await global.testRequest.post("/users").send(newUser);
    const response = await global.testRequest.post("/users").send(newUser);

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      code: 409,
      error: "Conflict",
      message: "User validation failed: email: already exists in the database.",

    });
  });

  describe("quando autenticar o usuario", () => {
    it("deve gerar o token para o usuario valido", async () => {
      const newUser = {
        name: "John doe",
        email: "testeTESTE@testeTESTE.com",
        password: "1234",
      };

      const response = await global.testRequest
        .post("/users/authenticate")
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it("deve retornar não autorizado se o usuario não for encontrado", async () => {
      const response = await global.testRequest
        .post("/users/authenticate")
        .send({
          email: "qualquerEmail@qualquer.com.qualquer",
          password: "1234",
        });

      expect(response.status).toBe(401);
    });

    it("deve retornar não autorizado se a senha do usuario não bater", async () => {
      const newUser = {
        name: "John doe",
        email: "testeTESTE@testeTESTE.com",
        password: "1234",
      };

      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: newUser.email, password: " UMA SENHA DIFERENTE" });

        expect(response.status).toBe(401);
    });
  });
});
