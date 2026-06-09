export default class Cliente {
  constructor(documento, nome) {
    if (!documento || !nome) {
      throw new Error('Documento e nome são obrigatórios.');
    }

    this.documento = String(documento).trim();
    this.nome = String(nome).trim();
    this.placas = new Set();
  }

  adicionarPlaca(placa) {
    const placaFormatada = this.#formatarPlaca(placa);
    this.placas.add(placaFormatada);
  }

  removerPlaca(placa) {
    this.placas.delete(this.#formatarPlaca(placa));
  }

  possuiPlaca(placa) {
    return this.placas.has(this.#formatarPlaca(placa));
  }

  listarPlacas() {
    return [...this.placas];
  }

  get tipo() {
    return this.constructor.name;
  }

  calcularValor() {
    return 0;
  }

  toCSV() {
    return [this.documento, this.nome, '', this.tipo, ...this.listarPlacas()].join(',');
  }

  #formatarPlaca(placa) {
    if (!placa) throw new Error('Placa inválida.');
    return String(placa).trim().toUpperCase();
  }
}
