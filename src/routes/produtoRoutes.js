const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/ProdutoController");

// Rotas para produtos
router.post("/", ProdutoController.create); // POST /produtos
router.get("/", ProdutoController.findAll); // GET /produtos
router.get("/:id", ProdutoController.findById); // GET /produtos/:id
router.put("/:id", ProdutoController.update); // PUT /produtos/:id
router.delete("/:id", ProdutoController.delete); // DELETE /produtos/:id

module.exports = router;
