"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizaConsumo = void 0;
const user_1 = require("@src/models/user");
const dataAtual_1 = require("@src/util/dataAtual");
class AtualizaConsumo {
    static async adicionaUmConsumo(req) {
        const dataAtual = new dataAtual_1.DataAtual();
        const mesAno = dataAtual.mesAtual() + dataAtual.anoAtual();
        const diaAtual = dataAtual.diaAtual();
        const user = await user_1.User.findById(req.decoded?.id);
        if (user) {
            let consumo = user.consumo;
            if (!consumo[mesAno]) {
                consumo[mesAno] = {};
            }
            if (!consumo[mesAno][diaAtual]) {
                consumo[mesAno] = {
                    ...consumo[mesAno],
                    ...{ [diaAtual]: 0 },
                };
            }
            consumo[mesAno][diaAtual]++;
            await user_1.User.findByIdAndUpdate(req.decoded?.id, { consumo: consumo });
        }
    }
}
exports.AtualizaConsumo = AtualizaConsumo;
//# sourceMappingURL=consumo.js.map