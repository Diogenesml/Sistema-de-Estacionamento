import Cliente from './Cliente.js';

export default class Estudante extends Cliente {
  static CUSTO_FIXO_POR_INGRESSO = 15;

  constructor(cpf, nome, saldo = 0, custoFixoPorIngresso = Estudante.CUSTO_FIXO_POR_INGRESSO) {
    super(cpf, nome);
    this.saldo = Number(saldo) || 0;
    this.custoFixoPorIngresso = Number(custoFixoPorIngresso) || Estudante.CUSTO_FIXO_POR_INGRESSO;
  }

  calcularValor() {
    return this.custoFixoPorIngresso;
  }

  debitar(valor) {
    this.saldo -= Number(valor) || 0;
  }

  creditar(valor) {
    this.saldo += Number(valor) || 0;
  }

  carregarSaldo(valor) {
    this.creditar(valor);
  }

  toCSV() {
    return [this.documento, this.nome, this.saldo, 'Estudante', ...this.listarPlacas()].join(',');
  }
}
