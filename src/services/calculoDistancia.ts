import { Destino, GoogleDistance } from "@src/clients/googleDistance";
import { Cidade } from "@src/models/cidade";
import { InternalError } from "@src/util/internal-error";

export interface CidadeDadosFinais
  extends Omit<Cidade, "distancia" | "municipio"> {}

export interface DadosFinaisDistanciaDados {
  origem: CidadeDadosFinais;
  destino: CidadeDadosFinais;
  distancia: number;
}

export class CalculoDistanciaInternoErro extends InternalError {
  constructor(message: string) {
    super(
      `Erro inesperado durante o processamento de calculoDistanciaInterno: ${message}`
    );
  }
}

export class DistanciaDados {
  constructor(protected googleDistance = new GoogleDistance()) {}

  public async processandoDadosCidades(
    cidadeOrigem: Cidade,
    cidadeDestino: Cidade
  ): Promise<DadosFinaisDistanciaDados> {
    try {
      if (
        !!(!cidadeOrigem.distancia?.[cidadeDestino.codigo_municipio_completo])
      ) {
        const responseGoogle = await this.googleDistance.buscaDistancia(
          { cidade: cidadeOrigem.nome_municipio, uf: cidadeOrigem.UF },
          { cidade: cidadeDestino.nome_municipio, uf: cidadeDestino.UF }
        );


        !cidadeOrigem.distancia ? (cidadeOrigem["distancia"] = {}) : "";

        cidadeOrigem.distancia[`${cidadeDestino.codigo_municipio_completo}`] = {
          cidade: responseGoogle.destino.cidade,
          UF: responseGoogle.destino.uf,
          distancia: responseGoogle.distancia,
        };

        this.updateInfoBanco(cidadeOrigem);

        return this.normalizaDados(cidadeOrigem, cidadeDestino);
      }

      return this.normalizaDados(cidadeOrigem, cidadeDestino);
    } catch (error) {
      throw new CalculoDistanciaInternoErro((error as Error).message);
    }
  }

  private normalizaDados(
    origem: Cidade,
    destino: Cidade
  ): DadosFinaisDistanciaDados {
    // faz a configuração dos dados de acordo com o retorno da API
    return {
      origem: {
        nome_municipio: origem.nome_municipio,
        UF: origem.UF,
        nome_UF: origem.nome_UF,
        codigo_UF: origem.codigo_UF,
        codigo_municipio_completo: origem.codigo_municipio_completo,
      },
      destino: {
        nome_municipio: destino.nome_municipio,
        UF: destino.UF,
        nome_UF: destino.nome_UF,
        codigo_UF: destino.codigo_UF,
        codigo_municipio_completo: destino.codigo_municipio_completo,
      },
      distancia: origem.distancia?.[destino.codigo_municipio_completo]
        .distancia as number,
    };
  }

  private async updateInfoBanco(origem: Cidade): Promise<void> {
    const findOne = {
      codigo_municipio_completo: origem.codigo_municipio_completo,
    };
    const update = { distancia: origem.distancia };
    
    await Cidade.findOneAndUpdate(findOne, update);
  }
}
