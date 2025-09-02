var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({
    message: "Esta é uma rota padrão do Express.",
    note: "Para a API principal, use as rotas /produtos e /clientes",
  });
});

module.exports = router;
