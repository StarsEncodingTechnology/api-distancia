import { Consumo, User } from "@src/models/user";
import { DataAtual } from "@src/util/dataAtual";
import { Request } from "express";

export class AtualizaConsumo {
  public static async adicionaUmConsumo(req: Request): Promise<void> {
    const dataAtual = new DataAtual();
    const mesAno = dataAtual.mesAtual() + dataAtual.anoAtual()
    const diaAtual = "03"
    const user = await User.findById(req.decoded?.id);
    if (user) {
      let consumo: Consumo = user.consumo;

      if(!consumo[mesAno]){
        consumo[mesAno] = {}
      }

      if(!consumo[mesAno][diaAtual]){
        consumo[mesAno] = {
          [diaAtual]: 0
        }
      }

      consumo[mesAno][diaAtual]++

      await user.updateOne({consumo: consumo})
    }
  }
}
