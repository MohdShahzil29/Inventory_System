const InventoryHistory = require("../models/InventoryHistory");

// Get inventory history for a product
exports.getInventoryHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const history = await InventoryHistory.find({ productId })
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all inventory history
exports.getAllInventoryHistory = async (req, res) => {
  try {
    const history = await InventoryHistory.find()
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
