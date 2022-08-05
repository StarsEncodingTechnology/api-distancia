import { User } from "@src/models/user";

describe("Testes funcionais do Users", () => {
  describe("Quando criar um novo usuario", () => {
    it("deve criar um novo usuario com sucesso", async () => {
      const newUser = {
        name: "John doe",
        email: "testeTESTE@testeTESTE.com",
        password: "1234",
      };

      await User.findOneAndDelete({email: newUser.email})

      const response = await global.testRequest.post("/users").send(newUser)

      expect(response.status).toBe(201);

      expect(response.body).toEqual(expect.objectContaining(newUser))


    });
  });

  it("deve retorno um erro 400 quando faltar alguma informação" , async() => {
    const newUser = {
        name: "John doe",
        password: "1234",
      };

      const response = await global.testRequest.post('/users').send(newUser)

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        code: 400,
        error: "User validation failed: email: Path `email` is required."
      })

    
  })

});
