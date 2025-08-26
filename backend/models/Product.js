const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    unit: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "Out of Stock",
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Update status based on stock before saving
productSchema.pre("save", function (next) {
  this.status = this.stock > 0 ? "In Stock" : "Out of Stock";
  next();
});

module.exports = mongoose.model("Product", productSchema);
