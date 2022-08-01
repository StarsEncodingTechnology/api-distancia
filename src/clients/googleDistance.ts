import { InternalError } from "@src/util/internal-error";
import * as HTTPUtil from "@src/util/request";
import config, { IConfig } from "config";

const googledistancematrix: IConfig = config.get(
  "App.resources.googleDistancematrix"
);

export interface Destino {
  cidade: string;
  uf: string;
}

export interface Origem extends Destino {}

export interface DadosCorretosGoogleMatrix {
  origem: Destino;
  destino: Origem;
  distancia: number;
}

export interface DistanceMatrix {
  text: string;
  value: number;
}

export interface DurationMatrix extends DistanceMatrix {}

export interface ElementsDistanciaMatrix {
  distance: DistanceMatrix;
  duration: DurationMatrix;
  status: string;
}

export interface RowsElementsDistanciaMatrix {
  elements: ElementsDistanciaMatrix[];
}

export interface ResponseGoogleMatrix {
  readonly destination_adresses: Array<string>;
  readonly origin_adresses: Array<string>;
  readonly rows: RowsElementsDistanciaMatrix[];
  readonly status: string;
}

export class DistanciaVaziaError extends InternalError {
  constructor(error: string) {
    const internalMessage: string = "Erro a API não retornou uma distancia: ";
    super(`${internalMessage}: ${error}`);
  }
}

export class GenericoClientError extends InternalError {
  constructor(error: string) {
    const internalMessage: string = "Erro generico do client: ";
    super(`${internalMessage} ${error}`);
  }
}

export class apiInesperadoError extends InternalError {
  constructor(message: string) {
    const internalError = "algum erro inesperado da googleMatrix: ";
    super(`${internalError} ${message}`);
  }
}

export class apiNegadaError extends InternalError {
  constructor(message: string) {
    const internalError = "Erro a api retornou: "
    super(`${internalError} ${message}`)
  }
}

export class GoogleDistance {
  constructor(protected request = new HTTPUtil.Request()) {}

  public async buscaDistancia(
    origem: Origem,
    destino: Destino
  ): Promise<DadosCorretosGoogleMatrix> {
    const variavelDestino = destino.cidade + "-" + destino.uf;
    const variavelOrigem = origem.cidade + "-" + origem.uf;
    try {
      const response = await this.request.get<ResponseGoogleMatrix>(`
        ${googledistancematrix.get(
          "apiUrl"
        )}/json?origens=${variavelDestino}&destinations=${variavelOrigem}&key=${googledistancematrix.get(
        "apiToken"
      )}  
    `);

      if (!!response.data.rows[0]?.elements[0]?.distance?.text) {
        return this.normalizaDados(response.data, destino, origem);
      }else if(!!(response.data.status.includes("REQUEST_DENIED"))){
        throw new apiNegadaError("REQUEST_DENIED");
        // erro de api negada
      } else {
        throw new DistanciaVaziaError("Distancia vazia");
        // lança um erro de distancia vazia
      }
    } catch (error) {
      if (error instanceof Error && HTTPUtil.Request.isRequestError(error)) {
        //  caso a api retorna um erro
        const err = HTTPUtil.Request.extractErrorData(error);
        throw new apiInesperadoError(
          `Error: ${JSON.stringify(err.data)} Code: ${err.status}`
        );
      }

      throw new GenericoClientError(JSON.stringify(error));
      // caso de erro generico
      // o erro de distancia vazio cai aqui tbm
    }
  }

  private normalizaDados(
    distancia: ResponseGoogleMatrix,
    destino: Destino,
    origem: Origem
  ): DadosCorretosGoogleMatrix {
    const valorDistance = distancia.rows[0].elements.find(
      (element) => !!element.distance.text
    )?.distance.text;
    const valorDistanciaNumber: number = Number.parseFloat(
      valorDistance?.split(" ")[0] as string
    );

    return {
      destino: {
        cidade: destino.cidade.toUpperCase(),
        uf: destino.uf.toUpperCase(),
      },
      origem: {
        cidade: origem.cidade.toUpperCase(),
        uf: origem.uf.toUpperCase(),
      },
      distancia: valorDistanciaNumber,
    };
  }
}
