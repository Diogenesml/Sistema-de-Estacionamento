import fs from 'fs';
import path from 'path';
import TicketEstacionamento from '../modelos/TicketEstacionamento.js';

export default class RegistroDeEntradas_E_Saidas {
  constructor(cadastroClientes = null) {
    this.cadastroClientes = cadastroClientes;
    this.tickets = [];
  }

  registrarEntrada(placa, entrada = new Date()) {
    const placaFormatada = String(placa).trim().toUpperCase();
    const ticketAberto = this.buscarTicketAberto(placaFormatada);

    if (ticketAberto) {
      throw new Error(`Já existe uma entrada aberta para a placa ${placaFormatada}.`);
    }

    const cliente = this.cadastroClientes?.buscarPorPlaca(placaFormatada);
    const tipoCliente = cliente?.tipo || 'Avulso';
    const ticket = new TicketEstacionamento(placaFormatada, tipoCliente, entrada);
    this.tickets.push(ticket);
    return ticket;
  }

  registrarSaida(placa, saida = new Date()) {
    const placaFormatada = String(placa).trim().toUpperCase();
    const ticket = this.buscarTicketAberto(placaFormatada);

    if (!ticket) {
      throw new Error(`Não existe entrada aberta para a placa ${placaFormatada}.`);
    }

    const cliente = this.cadastroClientes?.buscarPorPlaca(placaFormatada);
    ticket.saida = saida instanceof Date ? saida : new Date(saida);
    const dias = ticket.calcularDias();
    let valorCobrado = 20 * dias;
    let valorDesconto = 0;

    if (cliente) {
      valorCobrado = cliente.calcularValor(dias);

      if (cliente.tipo === 'Professor') {
        valorDesconto = 20 * dias;
      } else if (cliente.tipo === 'Estudante') {
        valorDesconto = Math.max(0, 20 * dias - valorCobrado);
        cliente.debitar(valorCobrado);
      } else if (cliente.tipo === 'Empresa') {
        cliente.adicionarDebito(valorCobrado);
      }
    }

    const valorPago = cliente?.tipo === 'Empresa' ? 0 : valorCobrado;
    ticket.registrarSaida(ticket.saida, valorCobrado, valorDesconto, valorPago);
    return ticket;
  }

  buscarTicketAberto(placa) {
    const placaFormatada = String(placa).trim().toUpperCase();
    return this.tickets.find(ticket => ticket.placa === placaFormatada && ticket.estaAberto());
  }

  listarAbertos() {
    return this.tickets.filter(ticket => ticket.estaAberto());
  }

  listarFinalizados() {
    return this.tickets.filter(ticket => !ticket.estaAberto());
  }

  carregarCSV(caminhoArquivo) {
    if (!fs.existsSync(caminhoArquivo)) return;

    const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
    const linhas = conteudo.split(/\r?\n/).filter(linha => linha.trim().length > 0);

    this.tickets = linhas.map(linha => TicketEstacionamento.fromCSV(linha, this.cadastroClientes));
  }

  salvarCSV(caminhoArquivo) {
    const diretorio = path.dirname(caminhoArquivo);
    fs.mkdirSync(diretorio, { recursive: true });
    const linhas = this.tickets.map(ticket => ticket.toCSV());
    fs.writeFileSync(caminhoArquivo, linhas.join('\n'), 'utf-8');
  }
}
