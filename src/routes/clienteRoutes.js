const express = require("express");
const router = express.Router();
const ClienteController = require("../controllers/clienteController");

router.post("/", ClienteController.create);
router.get("/", ClienteController.getAll);
router.get("/:id", ClienteController.find);
router.put("/:id", ClienteController.update);
router.delete("/:id", ClienteController.delete);

module.exports = router;
