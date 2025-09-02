var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({
    message: "Node.js API SQLite com Arquitetura MVC",
    version: "1.0.0",
    endpoints: {
      produtos: {
        "GET /produtos": "Listar produtos",
        "POST /produtos": "Criar produto",
        "GET /produtos/:id": "Buscar produto por ID",
        "PUT /produtos/:id": "Atualizar produto",
        "DELETE /produtos/:id": "Deletar produto",
      },
      clientes: {
        "GET /clientes": "Listar clientes",
        "POST /clientes": "Criar cliente",
        "GET /clientes/:id": "Buscar cliente por ID",
        "PUT /clientes/:id": "Atualizar cliente",
        "DELETE /clientes/:id": "Deletar cliente",
      },
    },
  });
});

module.exports = router;
