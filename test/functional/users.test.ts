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
});
