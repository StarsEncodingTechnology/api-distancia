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
  destination_adresses: Array<string>;
  origin_adresses: Array<string>;
  rows: RowsElementsDistanciaMatrix[];
  status: string;
}

export class GoogleDistance {
  constructor(protected request: HTTPUtil.Request) {}

  public async buscaDistancia(
    origem: Origem,
    destino: Destino
  ): Promise<DadosCorretosGoogleMatrix> {
    const variavelDestino = destino.cidade + "-" + destino.uf;
    const variavelOrigem = origem.cidade + "-" + origem.uf;

    const response = await this.request.get<ResponseGoogleMatrix>(`
        ${googledistancematrix.get(
          "apiUrl"
        )}/json?origens=${variavelDestino}&destinations=${variavelOrigem}&key=${googledistancematrix.get(
      "apiToken"
    )}  
    `);

    return this.normalizaDados(response.data, destino, origem);
  }

  private normalizaDados(
    distancia: ResponseGoogleMatrix,
    destino: Destino,
    origem: Origem
  ): DadosCorretosGoogleMatrix {
    const valorDistance = distancia.rows[0].elements.find(
      (element) => !!element?.distance?.text
    )?.distance.text;

    // const valorDistanciaNumber: number = Number.parseFloat(
    //   valorDistance?.split(" ")[0] || "error"
    // );

    return {
      destino: {
        cidade: destino.cidade,
        uf: destino.uf,
      },
      origem: {
        cidade: origem.cidade,
        uf: origem.uf,
      },
      distancia: 21,
    };
  }

  private validaDistancia(distanciaDados: ElementsDistanciaMatrix): Boolean {
    return !!distanciaDados?.["distance"];
  }
}
