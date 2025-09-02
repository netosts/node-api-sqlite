const request = require("supertest");
const app = require("../../app");

/**
 * Helper para testes de API
 */
class ApiTestHelper {
  /**
   * Fazer requisição POST
   */
  static post(url, data = {}) {
    return request(app)
      .post(url)
      .send(data)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");
  }

  /**
   * Fazer requisição GET
   */
  static get(url) {
    return request(app).get(url).set("Accept", "application/json");
  }

  /**
   * Fazer requisição PUT
   */
  static put(url, data = {}) {
    return request(app)
      .put(url)
      .send(data)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");
  }

  /**
   * Fazer requisição DELETE
   */
  static delete(url) {
    return request(app).delete(url).set("Accept", "application/json");
  }

  /**
   * Validar estrutura de resposta de erro
   */
  static expectErrorResponse(response, status, message) {
    expect(response.status).toBe(status);
    expect(response.body).toHaveProperty("error");
    if (message) {
      expect(response.body.error).toContain(message);
    }
  }

  /**
   * Validar estrutura de resposta de sucesso
   */
  static expectSuccessResponse(response, status = 200) {
    expect(response.status).toBe(status);
    expect(response.body).not.toHaveProperty("error");
  }

  /**
   * Validar estrutura de paginação
   */
  static expectPaginationStructure(response) {
    expect(response.body).toHaveProperty("pagination");
    const { pagination } = response.body;

    expect(pagination).toHaveProperty("current_page");
    expect(pagination).toHaveProperty("per_page");
    expect(pagination).toHaveProperty("total_items");
    expect(pagination).toHaveProperty("total_pages");
    expect(pagination).toHaveProperty("has_next");
    expect(pagination).toHaveProperty("has_prev");

    expect(typeof pagination.current_page).toBe("number");
    expect(typeof pagination.per_page).toBe("number");
    expect(typeof pagination.total_items).toBe("number");
    expect(typeof pagination.total_pages).toBe("number");
    expect(typeof pagination.has_next).toBe("boolean");
    expect(typeof pagination.has_prev).toBe("boolean");
  }

  /**
   * Validar estrutura de produto
   */
  static expectProdutoStructure(produto) {
    expect(produto).toHaveProperty("id");
    expect(produto).toHaveProperty("nome");
    expect(produto).toHaveProperty("preco");
    expect(produto).toHaveProperty("estoque");
    expect(produto).toHaveProperty("data_criacao");

    expect(typeof produto.id).toBe("number");
    expect(typeof produto.nome).toBe("string");
    expect(typeof produto.preco).toBe("number");
    expect(typeof produto.estoque).toBe("number");
    expect(typeof produto.data_criacao).toBe("string");
  }

  /**
   * Validar estrutura de cliente
   */
  static expectClienteStructure(cliente) {
    expect(cliente).toHaveProperty("id");
    expect(cliente).toHaveProperty("nome");
    expect(cliente).toHaveProperty("email");
    expect(cliente).toHaveProperty("data_criacao");

    expect(typeof cliente.id).toBe("number");
    expect(typeof cliente.nome).toBe("string");
    expect(typeof cliente.email).toBe("string");
    expect(typeof cliente.data_criacao).toBe("string");
  }
}

module.exports = ApiTestHelper;
