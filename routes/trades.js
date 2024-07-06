const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/trades");

// POST /trades
router.post("/", tradeController.createTrade);

// GET /trades
router.get("/", tradeController.getTrades);

// GET /trades/:id
router.get("/:id", tradeController.getTradeById);

// DELETE /trades/:id
router.delete("/:id", tradeController.methodNotAllowed);

// PUT /trades/:id
router.put("/:id", tradeController.methodNotAllowed);

// PATCH /trades/:id
router.patch("/:id", tradeController.methodNotAllowed);

module.exports = router;
