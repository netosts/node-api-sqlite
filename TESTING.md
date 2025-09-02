# Sistema de API Node.js com SQLite - Testes

## Estrutura de Testes Implementada

### 📋 Framework de Testes

- **Jest**: Framework principal para testes unitários, integração e E2E
- **Supertest**: Biblioteca para testes de API HTTP
- **Coverage**: Relatórios de cobertura de código integrados

### 🗂️ Organização dos Testes

```
tests/
├── fixtures/           # Dados de teste padronizados
│   ├── produtoFixtures.js
│   └── clienteFixtures.js
├── helpers/            # Utilitários para testes
│   ├── TestDatabase.js
│   └── ApiTestHelper.js
├── unit/              # Testes unitários
│   ├── BaseValidator.test.js
│   ├── ProdutoValidator.test.js
│   ├── ClienteValidator.test.js
│   ├── ProdutoModel.test.js
│   └── ClienteModel.test.js
├── integration/       # Testes de integração
│   ├── ProdutoController.test.js
│   └── ClienteController.test.js
└── e2e/              # Testes end-to-end
    └── api.test.js
```

### 🧪 Tipos de Testes

#### 1. Testes Unitários

- **Validators**: Testam a lógica de validação isoladamente
- **Models**: Testam operações de banco de dados

#### 2. Testes de Integração

- **Controllers**: Testam fluxo completo controller → validator → model
- **API Endpoints**: Testam requests/responses HTTP

#### 3. Testes End-to-End

- **Fluxos Completos**: CRUD completo de entidades
- **Cenários Reais**: Múltiplas operações em sequência
- **Integridade**: Consistência de dados após operações

### 🔧 Configuração Jest

```json
{
  "testEnvironment": "node",
  "testMatch": ["**/tests/**/*.test.js"],
  "collectCoverage": true,
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov", "html"],
  "collectCoverageFrom": ["src/**/*.js", "!src/config/database.js"],
  "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
  "testTimeout": 30000
}
```

### 🛠️ Utilitários de Teste

#### TestDatabase

- Configuração isolada de banco para testes
- Cleanup automático entre testes
- Transações para isolamento

#### ApiTestHelper

- Métodos auxiliares para requests HTTP
- Padronização de testes de API
- Reutilização de código

#### Fixtures

- Dados de teste consistentes
- Cenários válidos e inválidos
- Facilita manutenção dos testes

### 📊 Cobertura de Testes

Os testes cobrem:

✅ **Validação de Dados**

- Todos os campos obrigatórios
- Formatos válidos/inválidos
- Sanitização de dados
- Tratamento de erros

✅ **Operações CRUD**

- Create: Criação com validação
- Read: Busca por ID, listagem, filtros
- Update: Atualização parcial/completa
- Delete: Remoção e verificação

✅ **Regras de Negócio**

- Email único para clientes
- Paginação correta
- Filtros por categoria/busca
- Timestamps automáticos

✅ **Tratamento de Erros**

- IDs inválidos
- Dados ausentes/incorretos
- Registros não encontrados
- Validação de entrada

### 🚀 Comandos de Teste

```bash
# Executar todos os testes
npm test

# Executar testes com watch mode
npm run test:watch

# Executar apenas testes unitários
npm test -- tests/unit

# Executar com coverage
npm run test:coverage

# Executar testes específicos
npm test -- --testNamePattern="deve criar produto"
```

### 📈 Benefícios da Estrutura

1. **Isolamento**: Cada tipo de teste tem responsabilidade clara
2. **Reutilização**: Fixtures e helpers evitam duplicação
3. **Manutenção**: Estrutura organizada facilita updates
4. **Cobertura**: Testes abrangentes garantem qualidade
5. **CI/CD Ready**: Configuração pronta para pipelines

### 🔍 Exemplos de Testes

#### Teste Unitário (Validator)

```javascript
test("deve validar dados corretos de criação", () => {
  const req = { body: produtoFixtures.produtoValido };
  const result = ProdutoValidator.validateCreate(req);

  expect(result.isValid).toBe(true);
  expect(result.data.nome).toBe("Produto Teste");
});
```

#### Teste de Integração (Controller)

```javascript
test("deve criar produto com dados válidos", async () => {
  const response = await apiHelper.createProduto(produtoFixtures.produtoValido);

  expect(response.status).toBe(201);
  expect(response.body.data).toHaveProperty("id");
});
```

#### Teste E2E (Fluxo Completo)

```javascript
test("deve realizar CRUD completo", async () => {
  // Create → Read → Update → Delete
  const created = await apiHelper.createProduto(data);
  const found = await request(app).get(`/api/produtos/${created.body.data.id}`);
  // ... sequência completa de operações
});
```

## ✨ Próximos Passos

Para executar os testes:

1. `npm test` - Executa toda a suite
2. Verifique a pasta `coverage/` para relatórios detalhados
3. Use `npm run test:watch` durante desenvolvimento

A estrutura está preparada para crescer com o projeto, mantendo qualidade e confiabilidade do código!
