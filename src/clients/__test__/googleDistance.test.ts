import { GoogleDistance } from "../googleDistance";
import respostaEsperado from "@test/fixtures/resposta_distancia.json";
import * as HTTPUtil from "@src/util/request";
import respostaGoogleCorreta from "@test/fixtures/resposta_API_google_distance_matrix.json";
import respostaGoogleSemDistancia from "@test/fixtures/respostaSemResultado_google_matrix.json";

jest.mock("@src/util/request");
// isso é pra mokar o axios
// o axios é a ferramentas de contato com  a api
// mock é a ferramenta para simulação de obj
// que serve para o teste sem necessidade de conexão real
// com API

describe("GoogleDistance client", () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;
  // da ao MockedRequestClass o valor da classe HTTPUtil sendo do tipo

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it("deve retornar os dados normalizados vindo da api do google", async () => {
    const origem = {
      cidade: "Franca",
      uf: "SP",
    };
    const destino = {
      cidade: "Cristais Paulista",
      uf: "SP",
    };

    mockedRequest.get.mockResolvedValue({
      data: respostaGoogleCorreta,
    } as HTTPUtil.Response);
    // define o valor correto para a promise quando resolver

    const googleDistance = new GoogleDistance(mockedRequest);
    // cria o OBJ com a simulução do valor
    const response = await googleDistance.buscaDistancia(origem, destino);
    // chama "função" que retornar os dados normalizados da API

    expect(response).toEqual(respostaEsperado);
    //
  });

  it("deve retornar um erro se a GoogleMatrix retornar sem resultados", async () => {
    const origem = {
      cidade: "Franca",
      uf: "SP",
    };
    const destino = {
      cidade: "Cristais Paulista",
      uf: "SP",
    };

    mockedRequest.get.mockResolvedValue({
      data: respostaGoogleSemDistancia,
    } as HTTPUtil.Response);
    // define o valor sem a distancia para a promise resolver

    const googleDistance = new GoogleDistance(mockedRequest);
    // instancia o OBJ

    await expect(
      googleDistance.buscaDistancia(origem, destino)
    ).rejects.toThrow(
      'Erro generico do client:  {"message":"Erro a API não retornou uma distancia: : Distancia vazia","code":500,"name":"DistanciaVaziaError"}'
    );
    // chama  a api e ela deve retornar um erro
  });

  it("deve retornar um erro se a api não responder", async () => {
    const origem = {
      cidade: "Franca",
      uf: "SP",
    };
    const destino = {
      cidade: "Cristais Paulista",
      uf: "SP",
    };

    mockedRequest.get.mockRejectedValue({ message: "Network error" });

    const googleDistance = new GoogleDistance(mockedRequest);

    await expect(
      googleDistance.buscaDistancia(origem, destino)
    ).rejects.toThrow('Erro generico do client:  {"message":"Network error"}');
  });

  it("deve retornar um a api retornar um error", async () => {
    const origem = {
      cidade: "Franca",
      uf: "SP",
    };
    const destino = {
      cidade: "Cristais Paulista",
      uf: "SP",
    };

    MockedRequestClass.isRequestError.mockReturnValue(true);

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 200,
        data: {
          destination_addresses: [],
          error_message: "The provided API key is invalid. ",
          origin_addresses: [],
          rows: [],
          status: "REQUEST_DENIED",
        },
      },
    });

    const googleDistance = new GoogleDistance(mockedRequest);

    await expect(
      googleDistance.buscaDistancia(origem, destino)
    ).rejects.toThrow(
      'Erro generico do client:  {"response":{"status":200,"data":{"destination_addresses":[],"error_message":"The provided API key is invalid. ","origin_addresses":[],"rows":[],"status":"REQUEST_DENIED"}}}'
    );
  });
});
