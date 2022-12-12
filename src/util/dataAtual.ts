export class DataAtual {
  constructor(protected data = new Date()) {
  }

  public diaAtual() {
    return this.casoNescessarioAdicionaZeroAesquerda(
      this.data.getDate().toString()
    );
  }
  public mesAtual() {
    return this.casoNescessarioAdicionaZeroAesquerda(
      (this.data.getMonth() + 1).toString()
    );
  }

  public anoAtual() {
    return this.data.getFullYear().toString();
  }

  private casoNescessarioAdicionaZeroAesquerda(stringProcessada: string) {
    return stringProcessada.length == 1
      ? "0" + stringProcessada
      : stringProcessada;
  }
}
