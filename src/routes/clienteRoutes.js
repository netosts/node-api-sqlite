const express = require("express");
const router = express.Router();
const ClienteController = require("../controllers/ClienteController");

// Rotas para clientes
router.post("/", ClienteController.create); // POST /clientes
router.get("/", ClienteController.findAll); // GET /clientes
router.get("/:id", ClienteController.findById); // GET /clientes/:id
router.put("/:id", ClienteController.update); // PUT /clientes/:id
router.delete("/:id", ClienteController.delete); // DELETE /clientes/:id

module.exports = router;
