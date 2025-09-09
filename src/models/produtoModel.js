class ProdutoModel {
  static tableName = "produtos";
  static fields = ["nome", "preco", "estoque"];
}

module.exports = ProdutoModel;
