import { Destino, GoogleDistance } from "@src/clients/googleDistance";
import { Cidade } from "@src/models/cidade";

export interface CidadeDadosFinais
  extends Omit<Cidade, "distancia" | "municipio"> {}

export interface DadosFinaisDistanciaDados {
  origem: CidadeDadosFinais;
  destino: CidadeDadosFinais;
  distancia: number;
}

export class DistanciaDados {
  constructor(protected googleDistance = new GoogleDistance()) {}

  public async processandoDadosCidades(
    cidadeOrigem: Cidade,
    cidadeDestino: Cidade
  ): Promise<DadosFinaisDistanciaDados> {
    if (
      !cidadeOrigem.distancia?.[cidadeDestino.codigo_municipio_completo]
        .distancia
    ) {
      const responseGoogle = await this.googleDistance.buscaDistancia(
        { cidade: cidadeOrigem.nome_municipio, uf: cidadeOrigem.UF },
        { cidade: cidadeDestino.nome_municipio, uf: cidadeDestino.UF }
      );

      if()

      return this.normalizaDados(cidadeOrigem, cidadeDestino);
    }

    return this.normalizaDados(cidadeOrigem, cidadeDestino);
  }

  private normalizaDados(
    origem: Cidade,
    destino: Cidade
  ): DadosFinaisDistanciaDados {
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
}
