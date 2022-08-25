import logger from "@src/logger";
import { Consumo, User } from "@src/models/user";
import { DataAtual } from "@src/util/dataAtual";
import { Request } from "express";

export class AtualizaConsumo {
  // obj para atualização do consumo
  public static async adicionaUmConsumo(req: Request): Promise<void> {
    // adiciona 1 ao contador de consumo
    const dataAtual = new DataAtual();
    const mesAno = dataAtual.mesAtual() + dataAtual.anoAtual()
    const diaAtual = dataAtual.diaAtual()
    const user = await User.findById(req.decoded?.id);
    if (user) {
      let consumo: Consumo = user.consumo;

      if(!consumo[mesAno]){
        consumo[mesAno] = {}
      }

      if(!consumo[mesAno][diaAtual]){
        consumo[mesAno] = {
          ...consumo[mesAno],
          ...{[diaAtual]: 0}
        }
      }

      consumo[mesAno][diaAtual]++

      if((consumo[mesAno][diaAtual] % 10) == 0){
        logger.info(` Consumo atual: ` + consumo[mesAno][diaAtual] +`. Desse Usuario: ` + req.decoded?.email)
      }

      await user.updateOne({consumo: consumo})
    }
  }
}
