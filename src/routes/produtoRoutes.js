const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/ProdutoController");

router.post("/", ProdutoController.create);
router.get("/", ProdutoController.findAll);
router.get("/:id", ProdutoController.findById);
router.put("/:id", ProdutoController.update);
router.delete("/:id", ProdutoController.delete);

module.exports = router;
