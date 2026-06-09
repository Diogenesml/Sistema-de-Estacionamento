export default class RelatoriosGerenciais {
  constructor(cadastro, registro) {
    this.cadastro = cadastro;
    this.registro = registro;
  }

  totalArrecadado() {
    return this.registro.tickets.reduce((soma, ticket) => soma + ticket.valorPago, 0);
  }

  totalEmDebitosEmpresariais() {
    return this.cadastro
      .listar()
      .filter(cliente => cliente.tipo === 'Empresa')
      .reduce((soma, empresa) => soma + empresa.debito, 0);
  }

  quantidadePorTipoCliente() {
    return this.cadastro.listar().reduce((acc, cliente) => {
      acc[cliente.tipo] = (acc[cliente.tipo] || 0) + 1;
      return acc;
    }, {});
  }

  veiculosNoPatio() {
    return this.registro.listarAbertos().map(ticket => ({
      placa: ticket.placa,
      tipoCliente: ticket.tipoCliente,
      entrada: ticket.entrada.toISOString()
    }));
  }

  historicoDeSaidas() {
    return this.registro.listarFinalizados().map(ticket => ({
      placa: ticket.placa,
      tipoCliente: ticket.tipoCliente,
      entrada: ticket.entrada.toISOString(),
      saida: ticket.saida.toISOString(),
      valorCobrado: ticket.valorCobrado,
      valorDesconto: ticket.valorDesconto,
      valorPago: ticket.valorPago,
      desconto: ticket.desconto
    }));
  }

  resumo() {
    return {
      clientesCadastrados: this.cadastro.listar().length,
      quantidadePorTipoCliente: this.quantidadePorTipoCliente(),
      veiculosNoPatio: this.veiculosNoPatio().length,
      ticketsFinalizados: this.registro.listarFinalizados().length,
      totalArrecadado: this.totalArrecadado(),
      totalEmDebitosEmpresariais: this.totalEmDebitosEmpresariais()
    };
  }
}
