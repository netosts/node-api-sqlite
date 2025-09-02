const http = require("http");

// Função para fazer requisições HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const result = {
            status: res.statusCode,
            data: JSON.parse(body),
          };
          resolve(result);
        } catch (err) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testValidators() {
  console.log(
    "🧪 Testando Nova Estrutura de Validação (Validators Separados)\n"
  );

  try {
    // 1. Testar validações de produto
    console.log("1. 📦 Testando validações de PRODUTO...\n");

    // 1a. Produto válido
    console.log("   1a. ✅ Produto válido:");
    const produtoValido = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/produtos",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        nome: "Produto Validator Test",
        preco: 199.99,
        estoque: 10,
      }
    );
    console.log(
      `       Status: ${produtoValido.status} - ${
        produtoValido.data.message || produtoValido.data.error
      }`
    );

    // 1b. Produto sem nome
    console.log("   1b. ❌ Produto sem nome:");
    const produtoSemNome = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/produtos",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        nome: "",
        preco: 199.99,
        estoque: 10,
      }
    );
    console.log(
      `       Status: ${produtoSemNome.status} - ${produtoSemNome.data.error}`
    );

    // 1c. Produto com preço inválido
    console.log("   1c. ❌ Produto com preço negativo:");
    const produtoPrecoInvalido = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/produtos",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        nome: "Produto Teste",
        preco: -50,
        estoque: 10,
      }
    );
    console.log(
      `       Status: ${produtoPrecoInvalido.status} - ${produtoPrecoInvalido.data.error}`
    );

    // 1d. Produto com estoque inválido
    console.log("   1d. ❌ Produto com estoque negativo:");
    const produtoEstoqueInvalido = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/produtos",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        nome: "Produto Teste",
        preco: 199.99,
        estoque: -5,
      }
    );
    console.log(
      `       Status: ${produtoEstoqueInvalido.status} - ${produtoEstoqueInvalido.data.error}`
    );

    console.log();

    // 2. Testar validações de cliente
    console.log("2. 👤 Testando validações de CLIENTE...\n");

    // 2a. Cliente válido
    console.log("   2a. ✅ Cliente válido:");
    const clienteValido = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/clientes",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        nome: "Cliente Validator Test",
        email: "validator.test@email.com",
      }
    );
    console.log(
      `       Status: ${clienteValido.status} - ${
        clienteValido.data.message || clienteValido.data.error
      }`
    );

    // 2b. Cliente sem nome
    console.log("   2b. ❌ Cliente sem nome:");
    const clienteSemNome = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/clientes",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        nome: "",
        email: "test@email.com",
      }
    );
    console.log(
      `       Status: ${clienteSemNome.status} - ${clienteSemNome.data.error}`
    );

    // 2c. Cliente sem email
    console.log("   2c. ❌ Cliente sem email:");
    const clienteSemEmail = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/clientes",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        nome: "Cliente Teste",
        email: "",
      }
    );
    console.log(
      `       Status: ${clienteSemEmail.status} - ${clienteSemEmail.data.error}`
    );

    // 2d. Cliente com email inválido
    console.log("   2d. ❌ Cliente com email inválido:");
    const clienteEmailInvalido = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/clientes",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        nome: "Cliente Teste",
        email: "email-invalido",
      }
    );
    console.log(
      `       Status: ${clienteEmailInvalido.status} - ${clienteEmailInvalido.data.error}`
    );

    // 2e. Cliente com email duplicado
    console.log("   2e. ❌ Cliente com email duplicado:");
    const clienteEmailDuplicado = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/clientes",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        nome: "Outro Cliente",
        email: "validator.test@email.com", // Mesmo email usado acima
      }
    );
    console.log(
      `       Status: ${clienteEmailDuplicado.status} - ${clienteEmailDuplicado.data.error}`
    );

    console.log();

    // 3. Testar validações de paginação
    console.log("3. 📄 Testando validações de PAGINAÇÃO...\n");

    // 3a. Paginação válida
    console.log("   3a. ✅ Paginação válida:");
    const paginacaoValida = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos?page=1&limit=5",
      method: "GET",
    });
    console.log(
      `       Status: ${paginacaoValida.status} - Produtos: ${
        paginacaoValida.data.produtos?.length || 0
      }`
    );

    // 3b. Página inválida
    console.log("   3b. ❌ Página inválida (0):");
    const paginaInvalida = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos?page=0&limit=5",
      method: "GET",
    });
    console.log(
      `       Status: ${paginaInvalida.status} - ${
        paginaInvalida.data.error || "OK"
      }`
    );

    // 3c. Limite inválido
    console.log("   3c. ❌ Limite muito alto (101):");
    const limiteInvalido = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos?page=1&limit=101",
      method: "GET",
    });
    console.log(
      `       Status: ${limiteInvalido.status} - ${
        limiteInvalido.data.error || "OK"
      }`
    );

    console.log();

    // 4. Testar validações de ID
    console.log("4. 🔍 Testando validações de ID...\n");

    // 4a. ID válido
    console.log("   4a. ✅ ID válido:");
    const idValido = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos/1",
      method: "GET",
    });
    console.log(
      `       Status: ${idValido.status} - ${
        idValido.data.nome || idValido.data.error || "Produto encontrado"
      }`
    );

    // 4b. ID inválido (texto)
    console.log("   4b. ❌ ID inválido (abc):");
    const idInvalido = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos/abc",
      method: "GET",
    });
    console.log(
      `       Status: ${idInvalido.status} - ${idInvalido.data.error}`
    );

    // 4c. ID negativo
    console.log("   4c. ❌ ID negativo (-1):");
    const idNegativo = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos/-1",
      method: "GET",
    });
    console.log(
      `       Status: ${idNegativo.status} - ${idNegativo.data.error}`
    );

    console.log();
    console.log("✅ Todos os testes de validação concluídos!");
    console.log("\n🎯 Benefícios da nova estrutura de Validators:");
    console.log("   • ✨ Validações centralizadas em arquivos específicos");
    console.log("   • 🔧 Controllers mais limpos e focados na lógica");
    console.log("   • 🧪 Validações facilmente testáveis");
    console.log(
      "   • 🔄 Reutilização de validações entre diferentes endpoints"
    );
    console.log("   • 📦 BaseValidator com métodos comuns");
    console.log("   • 🛡️ Validações consistentes e padronizadas");
    console.log("   • 📝 Melhor legibilidade e manutenção do código");
  } catch (error) {
    console.error("❌ Erro durante os testes:", error.message);
  }
}

// Executar testes
testValidators();
