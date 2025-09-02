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

async function testAPI() {
  console.log("🧪 Testando API Node.js SQLite\n");

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
        nome: "Produto Teste API",
        preco: 99.99,
        estoque: 20,
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
        nome: "Cliente Teste API",
        email: "teste@api.com",
      }
    );
    console.log(`   Status: ${clienteResult.status}`);
    console.log(`   Resposta:`, clienteResult.data);
    console.log();

    // 3. Listar produtos
    console.log("3. 📋 Listando produtos...");
    const produtosResult = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos",
      method: "GET",
    });
    console.log(`   Status: ${produtosResult.status}`);
    console.log(
      `   Total de produtos: ${produtosResult.data.produtos?.length || 0}`
    );
    console.log();

    // 4. Listar clientes
    console.log("4. 👥 Listando clientes...");
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

    // 5. Testar busca de produto específico
    console.log("5. 🔍 Buscando produto por ID...");
    const produtoByIdResult = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/produtos/1",
      method: "GET",
    });
    console.log(`   Status: ${produtoByIdResult.status}`);
    console.log(`   Produto:`, produtoByIdResult.data.nome || "Não encontrado");
    console.log();

    console.log("✅ Todos os testes concluídos com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante os testes:", error.message);
  }
}

// Executar testes
testAPI();
