class ClienteModel {
  static tableName = "clientes";
  static fields = ["nome", "email", "data_criacao"];
}

module.exports = ClienteModel;
