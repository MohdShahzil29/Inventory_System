const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

// GET /api/history - Get all inventory history
router.get("/", historyController.getAllInventoryHistory);

// GET /api/history/:productId - Get inventory history for a product
router.get("/:productId", historyController.getInventoryHistory);

module.exports = router;
