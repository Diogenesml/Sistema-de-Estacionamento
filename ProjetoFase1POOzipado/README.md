# Projeto Estacionamento - Fase 1

Projeto em JavaScript/Node.js para controle inicial de estacionamento com cadastro de clientes, registros de entrada/saída em CSV e relatórios básicos.

## Como executar

```bash
npm install
npm start
```

O projeto usa apenas recursos nativos do Node.js.

## Estrutura

```text
src/
  app.js
  modelos/
    Cliente.js
    Estudante.js
    Professor.js
    Empresa.js
    TicketEstacionamento.js
  servicos/
    CadastroClientes.js
    RegistroDeEntradas_E_Saidas.js
    RelatoriosGerenciais.js
dados/
  clientes.csv
  registros.csv
```

## Formato do arquivo `dados/clientes.csv`

Cada linha representa um cliente. Os dois primeiros campos são CPF/CNPJ e nome. O terceiro campo muda conforme o tipo:

- Se for numérico, representa saldo do estudante ou débito da empresa.
- Se for texto `Professor`, identifica cliente professor.
- Depois aparece o tipo do cliente, quando aplicável, e a lista de placas associadas.

Formatos aceitos:

```text
cpf,nome,saldo,Estudante,placa
cpf,nome,Professor,placa1,placa2,...
cnpj,nome,debito,Empresa,placa1,placa2,...
```

Exemplo incluído:

```text
12345678901,João Silva,100,Estudante,ABC1D23
34567890123,Carlos Oliveira,Professor,JKL4G56,GHI3F45
56789012345,Tecnopuc S.A.,30,Empresa,STU7J89,VWX8K90,YZA9L01
```

## Formato do arquivo `dados/registros.csv`

Cada linha representa um registro de estacionamento.

```text
placa,dataHoraEntrada,dataHoraSaida,valorCobrado,valorDesconto,valorPago
```

Registros incompletos, com saída e valores vazios, representam veículos que ainda estão no pátio:

```text
DEF2E34,2025-11-27T15:00:00,,,
```

Registros completos representam veículos que já saíram:

```text
ABC1D23,2025-11-27T08:30:00,2025-11-27T12:45:00,20,0,20
```

## Método de leitura de clientes

A classe `CadastroClientes` possui o método `carregarDeCSV(caminhoArquivo)`, compatível com o exemplo solicitado. Ela também mantém o método `carregarCSV(caminhoArquivo)` para uso direto no `app.js`.

A leitura detecta automaticamente:

- `Estudante`: campo 3 numérico + tipo `Estudante`.
- `Empresa`: campo 3 numérico + tipo `Empresa`.
- `Professor`: campo 3 textual `Professor`.

## Regras implementadas

- Estudante possui saldo e custo fixo por ingresso.
- Professor é isento.
- Empresa acumula débito.
- Registros completos e incompletos são lidos do CSV.
- Não é permitido abrir duas entradas simultâneas para a mesma placa.
- Relatórios disponíveis: resumo geral, veículos no pátio, histórico de saídas, total arrecadado, débitos empresariais e quantidade por tipo de cliente.
