export default class TicketEstacionamento {
  constructor(placa, tipoCliente = '', entrada = new Date()) {
    if (!placa) throw new Error('Placa é obrigatória para gerar ticket.');

    this.placa = String(placa).trim().toUpperCase();
    this.tipoCliente = tipoCliente;
    this.entrada = entrada instanceof Date ? entrada : new Date(entrada);
    this.saida = null;
    this.valorCobrado = 0;
    this.valorDesconto = 0;
    this.valorPago = 0;
  }

  registrarSaida(saida = new Date(), valorCobrado = 0, valorDesconto = 0, valorPago = 0) {
    this.saida = saida instanceof Date ? saida : new Date(saida);
    this.valorCobrado = Number(valorCobrado) || 0;
    this.valorDesconto = Number(valorDesconto) || 0;
    this.valorPago = Number(valorPago) || 0;
  }

  estaAberto() {
    return this.saida === null;
  }

  calcularDias() {
    const fim = this.saida || new Date();
    const milissegundosPorDia = 1000 * 60 * 60 * 24;
    return Math.max(1, Math.ceil((fim - this.entrada) / milissegundosPorDia));
  }

  toCSV() {
    return [
      this.placa,
      this.#formatarData(this.entrada),
      this.saida ? this.#formatarData(this.saida) : '',
      this.saida ? this.valorCobrado : '',
      this.saida ? this.valorDesconto : '',
      this.saida ? this.valorPago : ''
    ].join(',');
  }

  #formatarData(data) {
    return data.toISOString().slice(0, 19);
  }

  static fromCSV(linha, cadastroClientes = null) {
    const [placa, entrada, saida, valorCobrado, valorDesconto, valorPago] = linha.split(',').map(campo => campo.trim());
    const cliente = cadastroClientes?.buscarPorPlaca(placa);
    const ticket = new TicketEstacionamento(placa, cliente?.tipo || 'Avulso', new Date(entrada));

    if (saida) {
      ticket.registrarSaida(
        new Date(saida),
        Number(valorCobrado) || 0,
        Number(valorDesconto) || 0,
        Number(valorPago) || 0
      );
    }

    return ticket;
  }
}
