import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";
import ImportExport from "./components/ImportExport";
import InventoryHistory from "./components/InventoryHistory";
import { productAPI } from "./services/api";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductHistory, setSelectedProductHistory] = useState(null);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts({ page: currentPage });
    fetchCategories();
  }, [currentPage]); // depend on currentPage

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(params);

      // Backend response format: { products, totalPages, currentPage }
      setProducts(response.data.products || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = async (searchTerm) => {
    await fetchProducts({ name: searchTerm, page: 1 });
  };

  const handleCategoryFilter = async (category) => {
    await fetchProducts({
      category: category !== "All" ? category : undefined,
      page: 1,
    });
  };

  const handleEditProduct = async (id, updatedProduct) => {
    try {
      const response = await productAPI.update(id, updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? response.data : p))
      );
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productAPI.delete(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleViewHistory = (productId) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProductHistory({
      id: productId,
      name: product?.name || "Unknown Product",
    });
    setShowHistorySidebar(true);
  };

  const handleImportComplete = () => {
    fetchProducts({ page: 1 }); // Refresh after import
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Management System</h1>
        <ImportExport onImportComplete={handleImportComplete} />
      </header>

      <main className="app-main">
        <SearchBar
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          categories={categories}
        />

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <ProductTable
            products={products}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage} // 🔹 send page change handler
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onViewHistory={handleViewHistory}
          />
        )}
      </main>

      {showHistorySidebar && selectedProductHistory && (
        <InventoryHistory
          productId={selectedProductHistory.id}
          productName={selectedProductHistory.name}
          onClose={() => setShowHistorySidebar(false)}
        />
      )}
    </div>
  );
}

export default App;
