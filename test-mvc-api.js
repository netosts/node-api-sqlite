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

async function testMVCAPI() {
  console.log("🧪 Testando API Node.js SQLite com Arquitetura MVC\n");

  try {
    // 1. Testar cadastro de produto
    console.log("1. 📦 Cadastrando produto...");
    const produtoResult = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/produtos",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        nome: "Smartphone Samsung Galaxy",
        preco: 1299.99,
        estoque: 15,
      }
    );
    console.log(`   Status: ${produtoResult.status}`);
    console.log(`   Resposta:`, produtoResult.data);
    console.log();

    // 2. Testar cadastro de cliente
    console.log("2. 👤 Cadastrando cliente...");
    const clienteResult = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/clientes",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        nome: "Maria Silva MVC",
        email: "maria.mvc@email.com",
      }
    );
    console.log(`   Status: ${clienteResult.status}`);
    console.log(`   Resposta:`, clienteResult.data);
    console.log();

    // 3. Listar produtos com paginação
    console.log("3. 📋 Listando produtos (página 1, limite 5)...");
    const produtosResult = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos?page=1&limit=5",
      method: "GET",
    });
    console.log(`   Status: ${produtosResult.status}`);
    console.log(
      `   Total de produtos: ${produtosResult.data.produtos?.length || 0}`
    );
    console.log(`   Paginação:`, produtosResult.data.pagination);
    console.log();

    // 4. Buscar produtos com filtro
    console.log('4. 🔍 Buscando produtos com filtro "Samsung"...');
    const buscaResult = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos?search=Samsung",
      method: "GET",
    });
    console.log(`   Status: ${buscaResult.status}`);
    console.log(
      `   Produtos encontrados: ${buscaResult.data.produtos?.length || 0}`
    );
    console.log();

    // 5. Testar busca de produto específico
    console.log("5. 🔍 Buscando produto por ID (ID: 1)...");
    const produtoByIdResult = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos/1",
      method: "GET",
    });
    console.log(`   Status: ${produtoByIdResult.status}`);
    if (produtoByIdResult.data.nome) {
      console.log(
        `   Produto: ${produtoByIdResult.data.nome} - R$ ${produtoByIdResult.data.preco}`
      );
    } else {
      console.log(`   Resposta:`, produtoByIdResult.data);
    }
    console.log();

    // 6. Listar clientes
    console.log("6. 👥 Listando clientes...");
    const clientesResult = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/clientes",
      method: "GET",
    });
    console.log(`   Status: ${clientesResult.status}`);
    console.log(
      `   Total de clientes: ${clientesResult.data.clientes?.length || 0}`
    );
    console.log();

    // 7. Testar validação de email duplicado
    console.log("7. ⚠️  Testando email duplicado...");
    const emailDuplicadoResult = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/clientes",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        nome: "Outro Cliente",
        email: "maria.mvc@email.com", // Email já usado
      }
    );
    console.log(`   Status: ${emailDuplicadoResult.status}`);
    console.log(`   Resposta:`, emailDuplicadoResult.data);
    console.log();

    // 8. Testar validação de dados inválidos
    console.log("8. ❌ Testando dados inválidos...");
    const dadosInvalidosResult = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/produtos",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        nome: "", // Nome vazio
        preco: -100, // Preço negativo
        estoque: "abc", // Estoque inválido
      }
    );
    console.log(`   Status: ${dadosInvalidosResult.status}`);
    console.log(`   Resposta:`, dadosInvalidosResult.data);
    console.log();

    console.log("✅ Todos os testes da arquitetura MVC concluídos!");
    console.log("\n📈 Benefícios da arquitetura MVC implementada:");
    console.log("   • Separação clara de responsabilidades");
    console.log("   • Models reutilizáveis e testáveis");
    console.log("   • Controllers focados na lógica de negócio");
    console.log("   • Routes simples e organizadas");
    console.log("   • Validações centralizadas");
    console.log("   • Fácil manutenção e escalabilidade");
  } catch (error) {
    console.error("❌ Erro durante os testes:", error.message);
  }
}

// Executar testes
testMVCAPI();
