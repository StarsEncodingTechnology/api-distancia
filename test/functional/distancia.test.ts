import supertest from "supertest";
import distanciaJson from "@test/fixtures/resposta_distancia.json";

describe("Distancia entre cidades teste funcional", () => {
  it("deve retonar a distancia entre as cidades", async () => {
    const { body, status } = await supertest(app).get("/distancia");
    // pega o valor retornado pela API

    expect(status).toBe(200);
    // o retorno tem que ser 200
    expect(body).toEqual(distanciaJson);
    // o corpo tem que bater com a api esperada
  });
});
