# Node.js API com SQLite

API REST desenvolvida em Node.js com Express e SQLite para gerenciamento de produtos e clientes.

## 🚀 Tecnologias Utilizadas

- Node.js
- Express.js
- SQLite3
- JavaScript

## 📋 Requisitos

- Node.js (versão 14 ou superior)
- npm

## 🛠️ Instalação e Execução

1. **Clone o repositório:**

```bash
git clone <url-do-repositorio>
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

## 📚 Endpoints da API

### Produtos

#### POST /produtos

Cadastra um novo produto.

**Body (JSON):**

```json
{
  "nome": "Nome do Produto",
  "preco": 29.99,
  "estoque": 100
}
```

**Validações:**

- `nome`: obrigatório, não pode ser vazio
- `preco`: obrigatório, deve ser um número maior que zero
- `estoque`: opcional, padrão 0, deve ser um número não negativo

#### GET /produtos

Lista todos os produtos com paginação e busca.

**Query Parameters:**

- `page`: página atual (padrão: 1)
- `limit`: itens por página (padrão: 10)
- `search`: busca por nome do produto

**Exemplo:** `GET /produtos?page=1&limit=5&search=produto`

#### GET /produtos/:id

Busca um produto específico pelo ID.

### Clientes

#### POST /clientes

Cadastra um novo cliente.

**Body (JSON):**

```json
{
  "nome": "Nome do Cliente",
  "email": "cliente@email.com"
}
```

**Validações:**

- `nome`: obrigatório, não pode ser vazio
- `email`: obrigatório, deve ter formato válido e ser único

#### GET /clientes

Lista todos os clientes com paginação e busca.

**Query Parameters:**

- `page`: página atual (padrão: 1)
- `limit`: itens por página (padrão: 10)
- `search`: busca por nome ou email do cliente

**Exemplo:** `GET /clientes?page=1&limit=5&search=joão`

#### GET /clientes/:id

Busca um cliente específico pelo ID.

## 🗄️ Estrutura do Banco de Dados

### Tabela: produtos

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `nome`: TEXT NOT NULL
- `preco`: REAL NOT NULL
- `estoque`: INTEGER NOT NULL DEFAULT 0
- `data_criacao`: DATETIME DEFAULT CURRENT_TIMESTAMP

### Tabela: clientes

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `nome`: TEXT NOT NULL
- `email`: TEXT NOT NULL UNIQUE
- `data_criacao`: DATETIME DEFAULT CURRENT_TIMESTAMP

## 📁 Estrutura do Projeto (Arquitetura MVC + Validators)

```
node-api-sqlite/
├── app.js                     # Configuração principal do Express
├── package.json              # Dependências e scripts
├── bin/
│   └── www                   # Servidor HTTP
├── src/                      # Código fonte da aplicação (MVC)
│   ├── config/
│   │   └── database.js       # Configuração do SQLite
│   ├── models/
│   │   ├── ProdutoModel.js   # Model para produtos
│   │   └── ClienteModel.js   # Model para clientes
│   ├── controllers/
│   │   ├── ProdutoController.js # Controller para produtos
│   │   └── ClienteController.js # Controller para clientes
│   ├── validators/           # 🆕 NOVA CAMADA DE VALIDAÇÃO
│   │   ├── BaseValidator.js  # Validador base com métodos comuns
│   │   ├── ProdutoValidator.js # Validador específico para produtos
│   │   └── ClienteValidator.js # Validador específico para clientes
│   ├── routes/
│   │   ├── produtoRoutes.js  # Rotas dos produtos
│   │   └── clienteRoutes.js  # Rotas dos clientes
│   └── utils/
│       └── validators.js     # Utilitários de validação (legacy)
├── database/
│   ├── database.sqlite       # Arquivo do banco (criado automaticamente)
│   └── seed-data.sql         # Dados de exemplo
├── routes/                   # Rotas padrão do Express (mantidas)
│   ├── index.js             # Rota principal
│   └── users.js             # Rota de usuários
├── public/                   # Arquivos estáticos
├── views/                    # Templates mínimos
├── test-validators.js       # 🆕 Testes da nova estrutura de validação
├── test-mvc-api.js          # Testes da arquitetura MVC
└── README.md                # Este arquivo
```

## ✅ Checklist do Teste Técnico

- [x] Criar uma API em Node.js usando Express.js
- [x] Utilizar SQLite como banco de dados
- [x] Criar duas tabelas no banco:
  - [x] produtos → id, nome, preço, estoque, data de criação
  - [x] clientes → id, nome, email, data de criação
- [x] Implementar rotas de cadastro:
  - [x] POST /produtos → cadastrar produto
  - [x] POST /clientes → cadastrar cliente
- [x] Implementar rotas de consulta:
  - [x] GET /produtos → listar produtos (com paginação e busca)
  - [x] GET /produtos/:id → buscar produto por ID
  - [x] GET /clientes → listar clientes
  - [x] GET /clientes/:id → buscar cliente por ID
- [x] Regras de validação:
  - [x] Produto deve ter nome e preço obrigatórios
  - [x] Cliente deve ter nome e email obrigatórios
  - [x] Email de cliente deve ser único
- [x] Entregar junto instruções claras de como rodar a API:
  - [x] Instalação de dependências (npm install)
  - [x] Execução do projeto (npm start)

## 🧪 Testando a API

### Teste automatizado da aplicação utilizando Jest

```bash
npm test
```

### Testes manuais utilizando cURL

**Cadastrar um produto:**

```bash
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Notebook","preco":2500.00,"estoque":10}'
```

**Listar produtos:**

```bash
curl http://localhost:3000/produtos
```

**Cadastrar um cliente:**

```bash
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com"}'
```

**Listar clientes:**

```bash
curl http://localhost:3000/clientes
```

## 📄 Licença

Este projeto é apenas para fins de teste técnico.
