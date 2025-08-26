import React, { useState } from "react";

const ProductTable = ({ products, onEdit, onDelete, onViewHistory }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditForm({ ...product });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveClick = async () => {
    try {
      await onEdit(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </td>

              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name || ""}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  product.name
                )}
              </td>

              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    name="unit"
                    value={editForm.unit || ""}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  product.unit
                )}
              </td>

              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    name="category"
                    value={editForm.category || ""}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  product.category
                )}
              </td>

              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    name="brand"
                    value={editForm.brand || ""}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  product.brand
                )}
              </td>

              <td>
                {editingId === product._id ? (
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock || 0}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  product.stock
                )}
              </td>

              <td>
                <span
                  className={`status ${
                    product.status === "In Stock" ? "in-stock" : "out-of-stock"
                  }`}
                >
                  {product.status}
                </span>
              </td>

              <td>
                {editingId === product._id ? (
                  <div className="action-buttons">
                    <button onClick={handleSaveClick} className="save-btn">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => onViewHistory(product._id)}
                      className="history-btn"
                    >
                      History
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
