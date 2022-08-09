import { User, comparePassword } from "@src/models/user";

describe("Testes funcionais do Users", () => {
  describe("Quando criar um novo usuario", () => {
    it("deve criar um novo usuario com sucesso", async () => {
      const newUser = {
        name: "John doe",
        email: "testeTESTE@testeTESTE.com",
        password: "1234",
      };

      await User.findOneAndDelete({ email: newUser.email });

      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(201);
      await expect(
        comparePassword(newUser.password, response.body.password)
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
      error: "User validation failed: email: Path `email` is required.",
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
      error: "User validation failed: email: already exists in the database.",
    });
  });
});
