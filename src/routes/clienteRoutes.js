const express = require("express");
const router = express.Router();
const ClienteController = require("../controllers/ClienteController");

router.post("/", ClienteController.create);
router.get("/", ClienteController.findAll);
router.get("/:id", ClienteController.findById);
router.put("/:id", ClienteController.update);
router.delete("/:id", ClienteController.delete);

module.exports = router;
