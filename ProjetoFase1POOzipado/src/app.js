import path from 'path';
import { fileURLToPath } from 'url';
import CadastroClientes from './servicos/CadastroClientes.js';
import RegistroDeEntradas_E_Saidas from './servicos/RegistroDeEntradas_E_Saidas.js';
import RelatoriosGerenciais from './servicos/RelatoriosGerenciais.js';
import Estudante from './modelos/Estudante.js';
import Professor from './modelos/Professor.js';
import Empresa from './modelos/Empresa.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoDados = path.resolve(__dirname, '../dados');
const caminhoClientes = path.join(caminhoDados, 'clientes.csv');
const caminhoRegistros = path.join(caminhoDados, 'registros.csv');

const cadastro = new CadastroClientes();
cadastro.carregarCSV(caminhoClientes);

if (cadastro.listar().length === 0) {
  const estudante = new Estudante('12345678901', 'João Silva', 100);
  estudante.adicionarPlaca('ABC1D23');

  const professora = new Professor('34567890123', 'Carlos Oliveira', 'Professor');
  professora.adicionarPlaca('JKL4G56');
  professora.adicionarPlaca('GHI3F45');

  const empresa = new Empresa('45678912000199', 'Empresa Exemplo LTDA', 0);
  empresa.adicionarPlaca('MNO5H67');

  cadastro.cadastrar(estudante);
  cadastro.cadastrar(professora);
  cadastro.cadastrar(empresa);
  cadastro.salvarCSV(caminhoClientes);
}

const registros = new RegistroDeEntradas_E_Saidas(cadastro);
registros.carregarCSV(caminhoRegistros);

const relatorios = new RelatoriosGerenciais(cadastro, registros);

console.log('Sistema de Estacionamento - Fase 1');
console.log('Resumo atual:');
console.table(relatorios.resumo());
console.log('Clientes cadastrados:');
console.table(cadastro.listar().map(cliente => ({
  documento: cliente.documento,
  nome: cliente.nome,
  tipo: cliente.tipo,
  placas: cliente.listarPlacas().join(' | ')
})));
