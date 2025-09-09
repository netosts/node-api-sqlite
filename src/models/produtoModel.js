class ProdutoModel {
  static tableName = "produtos";
  static fields = ["nome", "preco", "estoque", "data_criacao"];
}

module.exports = ProdutoModel;
