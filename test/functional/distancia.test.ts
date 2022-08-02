import distanciaJson from "@test/fixtures/resposta_distancia_service.json";

describe("Distancia entre cidades teste funcional", () => {
  it("deve retonar a distancia entre as cidades", async () => {
    const { body, status } = await global.testRequest.post("/distancia").send({
      "ibge-origem": "3516200",
      "ibge-destino": "3513207",
    });
    // pega o valor retornado pela API

    expect(status).toBe(200);
    // o retorno tem que ser 200
    expect(body).toEqual(distanciaJson);
    // o corpo tem que bater com a api esperada
  });
});
