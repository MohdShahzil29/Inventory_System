const Product = require("../models/Product");
const InventoryHistory = require("../models/InventoryHistory");
const csv = require("csv-parser");
const fs = require("fs");

// Get all products with optional search and filter
exports.getProducts = async (req, res) => {
  try {
    const { name, category, page = 1, limit = 10, sort = "name" } = req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
    };

    const products = await Product.find(query)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .sort(options.sort);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products by name
exports.searchProducts = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Product name must be unique" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Track inventory changes
    if (req.body.stock !== undefined && req.body.stock !== product.stock) {
      const historyEntry = new InventoryHistory({
        productId: id,
        oldQuantity: product.stock,
        newQuantity: req.body.stock,
        changedBy: req.user || "Admin", // In real app, get from auth
      });
      await historyEntry.save();
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Product name must be unique" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Also delete inventory history for this product
    await InventoryHistory.deleteMany({ productId: req.params.id });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Import products from CSV
exports.importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    const errors = [];
    const skipped = [];

    // Parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const item of results) {
          try {
            // Check if product already exists
            const existingProduct = await Product.findOne({ name: item.name });
            if (existingProduct) {
              skipped.push({
                product: item,
                reason: "Duplicate product name",
              });
              continue;
            }

            // Validate required fields
            if (!item.name || !item.unit || !item.category || !item.brand) {
              errors.push({
                product: item,
                reason: "Missing required fields",
              });
              continue;
            }

            // Create new product
            const product = new Product({
              name: item.name,
              unit: item.unit,
              category: item.category,
              brand: item.brand,
              stock: parseInt(item.stock) || 0,
              status:
                item.status || (item.stock > 0 ? "In Stock" : "Out of Stock"),
              image: item.image || "",
            });

            await product.save();
          } catch (error) {
            errors.push({
              product: item,
              reason: error.message,
            });
          }
        }

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
          message: "Import completed",
          imported: results.length - skipped.length - errors.length,
          skipped: skipped.length,
          errors: errors.length,
          skippedItems: skipped,
          errorItems: errors,
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export products to CSV
exports.exportProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });

    let csvData = "Name,Unit,Category,Brand,Stock,Status,Image\n";

    products.forEach((product) => {
      csvData += `"${product.name}",${product.unit},${product.category},${product.brand},${product.stock},${product.status},${product.image}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("products.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
