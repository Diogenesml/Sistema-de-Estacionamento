import Cliente from './Cliente.js';

export default class Empresa extends Cliente {
  constructor(cnpj, nome, debito = 0) {
    super(cnpj, nome);
    this.debito = Number(debito) || 0;
  }

  calcularValor(dias = 1) {
    return Math.max(1, dias) * 25;
  }

  adicionarDebito(valor) {
    const valorNumerico = Number(valor) || 0;
    this.debito += valorNumerico;
  }

  quitarDebito(valor) {
    const valorNumerico = Number(valor) || 0;
    this.debito = Math.max(0, this.debito - valorNumerico);
  }

  toCSV() {
    return [this.documento, this.nome, this.debito, 'Empresa', ...this.listarPlacas()].join(',');
  }
}
