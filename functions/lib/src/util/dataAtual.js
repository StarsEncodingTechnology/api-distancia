"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAtual = void 0;
class DataAtual {
    data;
    constructor(data = new Date()) {
        this.data = data;
    }
    diaAtual() {
        return this.casoNescessarioAdicionaZeroAesquerda(this.data.getDate().toString());
    }
    mesAtual() {
        return this.casoNescessarioAdicionaZeroAesquerda((this.data.getMonth() + 1).toString());
    }
    anoAtual() {
        return this.data.getFullYear().toString();
    }
    casoNescessarioAdicionaZeroAesquerda(stringProcessada) {
        return stringProcessada.length == 1
            ? "0" + stringProcessada
            : stringProcessada;
    }
}
exports.DataAtual = DataAtual;
//# sourceMappingURL=dataAtual.js.map