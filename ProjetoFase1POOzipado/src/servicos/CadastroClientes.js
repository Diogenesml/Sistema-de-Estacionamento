import fs from 'fs';
import path from 'path';
import Estudante from '../modelos/Estudante.js';
import Professor from '../modelos/Professor.js';
import Empresa from '../modelos/Empresa.js';

export default class CadastroClientes {
  constructor() {
    this.clientes = new Map();
  }

  get totalClientes() {
    return this.clientes.size;
  }

  cadastrar(cliente) {
    if (this.clientes.has(cliente.documento)) {
      throw new Error(`Cliente ${cliente.documento} já cadastrado.`);
    }
    this.clientes.set(cliente.documento, cliente);
    return cliente;
  }

  cadastrarCliente(cliente) {
    return this.cadastrar(cliente);
  }

  atualizar(cliente) {
    this.clientes.set(cliente.documento, cliente);
    return cliente;
  }

  buscar(documento) {
    return this.clientes.get(String(documento).trim());
  }

  buscarPorPlaca(placa) {
    const placaFormatada = String(placa).trim().toUpperCase();
    return this.listar().find(cliente => cliente.possuiPlaca(placaFormatada));
  }

  remover(documento) {
    return this.clientes.delete(String(documento).trim());
  }

  listar() {
    return [...this.clientes.values()];
  }

  async carregarDeCSV(caminhoArquivo) {
    if (!fs.existsSync(caminhoArquivo)) return this.totalClientes;

    const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
    const linhas = conteudo.split(/\r?\n/).filter(linha => linha.trim().length > 0);

    for (const linha of linhas) {
      const cliente = CadastroClientes.clienteFromCSV(linha);
      this.atualizar(cliente);
    }

    return this.totalClientes;
  }

  carregarCSV(caminhoArquivo) {
    if (!fs.existsSync(caminhoArquivo)) return;

    const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
    const linhas = conteudo.split(/\r?\n/).filter(linha => linha.trim().length > 0);

    for (const linha of linhas) {
      const cliente = CadastroClientes.clienteFromCSV(linha);
      this.atualizar(cliente);
    }
  }

  salvarCSV(caminhoArquivo) {
    const diretorio = path.dirname(caminhoArquivo);
    fs.mkdirSync(diretorio, { recursive: true });
    const linhas = this.listar().map(cliente => cliente.toCSV());
    fs.writeFileSync(caminhoArquivo, linhas.join('\n'), 'utf-8');
  }

  static clienteFromCSV(linha) {
    const cols = linha.split(',').map(campo => campo.trim());
    const [documento, nome, terceiroCampo = '', tipoCampo = '', ...placas] = cols;
    const campo2EhNumero = terceiroCampo !== '' && !Number.isNaN(Number(terceiroCampo));
    const tipoNormalizado = tipoCampo.toUpperCase();
    const campo2Normalizado = terceiroCampo.toUpperCase();

    let cliente;

    if (campo2EhNumero && tipoNormalizado === 'ESTUDANTE') {
      cliente = new Estudante(documento, nome, 0, Estudante.CUSTO_FIXO_POR_INGRESSO);
      cliente.carregarSaldo(Number(terceiroCampo));
    } else if (campo2EhNumero && tipoNormalizado === 'EMPRESA') {
      cliente = new Empresa(documento, nome, Number(terceiroCampo));
    } else if (campo2Normalizado === 'PROFESSOR') {
      cliente = new Professor(documento, nome, '');
      // Neste formato, Professor não tem campo tipoCliente separado.
      // As placas começam logo após a palavra Professor.
      placas.unshift(tipoCampo);
    } else if (tipoNormalizado === 'PROFESSOR') {
      cliente = new Professor(documento, nome, terceiroCampo);
    } else {
      throw new Error(`Linha ignorada: tipo de cliente desconhecido em "${linha}".`);
    }

    placas.filter(Boolean).forEach(placa => cliente.adicionarPlaca(placa));
    return cliente;
  }
}
