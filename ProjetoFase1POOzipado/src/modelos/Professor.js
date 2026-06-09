import Cliente from './Cliente.js';

export default class Professor extends Cliente {
  constructor(cpf, nome, departamento = '') {
    super(cpf, nome);
    this.departamento = departamento || '';
  }

  calcularValor() {
    return 0;
  }

  toCSV() {
    return [this.documento, this.nome, 'Professor', ...this.listarPlacas()].join(',');
  }
}
