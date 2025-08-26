const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");

// GET /api/products - Get all products with optional filtering
router.get("/", productController.getProducts);

// GET /api/products/search - Search products by name
router.get("/search", productController.searchProducts);

// GET /api/products/categories - Get all categories
router.get("/categories", productController.getCategories);

// ✅ Export before :id
router.get("/export", productController.exportProducts);

// ✅ Import before :id
router.post("/import", upload.single("file"), productController.importProducts);

// GET /api/products/:id - Get product by ID
router.get("/:id", productController.getProductById);

// POST /api/products - Create new product
router.post("/", productController.createProduct);

// PUT /api/products/:id - Update product
router.put("/:id", productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
