import { GoogleDistance } from "../googleDistance";
import respostaEsperado from "@test/fixtures/resposta_distancia.json";
import * as HTTPUtil from "@src/util/request";
import respostaGoogleCorreta from "@test/fixtures/resposta_API_google_distance_matrix.json";
import respostaGoogleSemDistancia from "@test/fixtures/respostaSemResultado_google_matrix.json"

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
        data: respostaGoogleCorreta
    } as HTTPUtil.Response)

    const googleDistance = new GoogleDistance(mockedRequest);
    const response = await googleDistance.buscaDistancia(origem, destino);

    expect(response).toEqual(respostaEsperado);
  });

  // it("deve retornar um erro se a GoogleMatrix retornar sem resultados",async () => {
  //   const origem = {
  //     cidade: "Franca",
  //     uf: "SP",
  //   };
  //   const destino = {
  //     cidade: "Cristais Paulista",
  //     uf: "SP",
  //   };

  //   mockedRequest.get.mockResolvedValue({
  //     data: respostaGoogleSemDistancia
  //   } as HTTPUtil.Response)


  //   const googleDistance = new GoogleDistance(mockedRequest);
  //   const response = await googleDistance.buscaDistancia(origem, destino);

  //   await expect(response).rejects.toThrow('asd')

  // })

});
