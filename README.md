# Descrição do Teste Técnico — Desenvolvedor FullStack

## Objetivo

Construir uma API em Node.js puro (http) ou qualquer biblioteca HTTP (Express, Fastify, etc.), que consuma dados de um banco de dados SQLite e permita realizar operações básicas de cadastro e consulta.

## Requisitos obrigatórios

### Tecnologia:

- A API deve ser criada utilizando Node.js puro (módulo http) ou qualquer biblioteca HTTP (ex.: Express, Fastify, Hapi etc.).

### Banco de dados:

- Utilizar SQLite como banco de dados.

- O banco deve possuir duas tabelas:
  - **produtos** (campos mínimos: id, nome, preço, estoque, data de criação)
  - **clientes** (campos mínimos: id, nome, email, data de criação)

### Rotas obrigatórias:

- **POST /produtos** → cadastrar um produto
- **GET /produtos** → listar produtos (com possibilidade de consulta por parâmetros simples, ex.: busca ou paginação)
- **GET /produtos/:id** → buscar produto pelo ID
- **POST /clientes** → cadastrar um cliente
- **GET /clientes** → listar clientes
- **GET /clientes/:id** → buscar cliente pelo ID

### Validações mínimas:

- Não permitir cadastro de produto sem nome ou preço.
- Não permitir cadastro de cliente sem nome ou email.
- Emails devem ser únicos.

### Entrega:

- Fornecer instruções de execução do projeto (ex.: npm install, npm start).
- O banco pode ser entregue com script de criação (SQL).
- Publique o código-fonte em um **repositório público** (GitHub, GitLab ou Bitbucket).
- Inclua esse **README.md** na raiz do repositório, com o checklist abaixo preenchido.
- Envie **apenas o link do repositório** como resposta final.

## ✅ Checklist do Teste Técnico

- [x] Criar uma **API em Node.js** usando:

  - Node.js puro (`http`) **ou** qualquer biblioteca HTTP (Express, Fastify, etc.)

- [x] Utilizar **SQLite** como banco de dados

- [x] Criar duas tabelas no banco:

  - **produtos** → id, nome, preço, estoque, data de criação
  - **clientes** → id, nome, email, data de criação

- [x] Implementar rotas de **cadastro**:

  - `POST /produtos` → cadastrar produto
  - `POST /clientes` → cadastrar cliente

- [x] Implementar rotas de **consulta**:

  - `GET /produtos` → listar produtos (com paginação ou busca simples)
  - `GET /produtos/:id` → buscar produto por ID
  - `GET /clientes` → listar clientes
  - `GET /clientes/:id` → buscar cliente por ID

- [x] Regras de **validação**:

  - Produto deve ter nome e preço obrigatórios
  - Cliente deve ter nome e email obrigatórios
  - Email de cliente deve ser **único**

- [x] Entregar junto instruções claras de como rodar a API:
  - Instalação de dependências (`npm install`)
  - Execução do projeto (`npm start`)

## 🛠️ Instalação e Execução

1. **Clone o repositório:**

```bash
git clone https://github.com/netosts/node-api-sqlite.git
cd node-api-sqlite
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Execute a aplicação:**

```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

## 🗄️ Populando o Banco de Dados (Opcional)

Para facilitar os testes, você pode popular o banco com dados de exemplo:

```bash
npm run seed
```

Este comando irá criar dados de exemplo para produtos e clientes no banco de dados.

## 🧪 Testando a API

### Testes Automatizados

**Executar todos os testes:**

```bash
npm test
```

**Executar testes com cobertura:**

```bash
npm run test:coverage
```

**Executar testes específicos:**

```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes end-to-end
npm run test:e2e
```

**Executar testes em modo watch (desenvolvimento):**

```bash
npm run test:watch
```

### Testes Manuais com cURL

**Cadastrar um produto:**

```bash
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Notebook","preco":2500.00,"estoque":10}'
```

**Listar produtos (com paginação):**

```bash
# Listar todos
curl http://localhost:3000/produtos

# Com paginação
curl "http://localhost:3000/produtos?page=1&limit=5"

# Com busca
curl "http://localhost:3000/produtos?search=Notebook"
```

**Buscar produto por ID:**

```bash
curl http://localhost:3000/produtos/1
```

**Cadastrar um cliente:**

```bash
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com"}'
```

**Listar clientes (com paginação):**

```bash
# Listar todos
curl http://localhost:3000/clientes

# Com paginação
curl "http://localhost:3000/clientes?page=1&limit=5"

# Com busca
curl "http://localhost:3000/clientes?search=João"
```

**Buscar cliente por ID:**

```bash
curl http://localhost:3000/clientes/1
```

**Atualizar um produto:**

```bash
curl -X PUT http://localhost:3000/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Notebook Atualizado","preco":2800.00,"estoque":8}'
```

**Atualizar um cliente:**

```bash
curl -X PUT http://localhost:3000/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva Santos","email":"joao.santos@email.com"}'
```

**Deletar um produto:**

```bash
curl -X DELETE http://localhost:3000/produtos/1
```

**Deletar um cliente:**

```bash
curl -X DELETE http://localhost:3000/clientes/1
```

## 📋 Scripts Disponíveis

| Comando                    | Descrição                                 |
| -------------------------- | ----------------------------------------- |
| `npm start`                | Inicia o servidor de produção             |
| `npm test`                 | Executa todos os testes                   |
| `npm run test:unit`        | Executa apenas testes unitários           |
| `npm run test:integration` | Executa apenas testes de integração       |
| `npm run test:e2e`         | Executa apenas testes end-to-end          |
| `npm run test:coverage`    | Executa testes com relatório de cobertura |
| `npm run test:watch`       | Executa testes em modo watch              |
| `npm run seed`             | Popula o banco com dados de exemplo       |

## 🏗️ Estrutura do Projeto

```
node-api-sqlite/
├── src/
│   ├── config/          # Configurações (banco de dados)
│   ├── controllers/     # Controladores das rotas
│   ├── middleware/      # Middlewares (tratamento de erro)
│   ├── models/          # Modelos de dados
│   ├── repositories/    # Camada de acesso aos dados
│   ├── routes/          # Definição das rotas
│   ├── services/        # Lógica de negócio
│   ├── tests/           # Testes automatizados
│   ├── utils/           # Utilitários e helpers
│   └── validators/      # Validações de entrada
├── database/            # Banco SQLite e scripts
├── scripts/             # Scripts utilitários
└── package.json         # Dependências e scripts
```
