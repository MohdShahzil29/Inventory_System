const mongoose = require("mongoose");

const inventoryHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    oldQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    changedBy: {
      type: String,
      default: "System",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InventoryHistory", inventoryHistorySchema);
