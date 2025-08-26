import React, { useState, useEffect } from "react";
import { historyAPI } from "../services/api";

const InventoryHistory = ({ productId, productName, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await historyAPI.getByProductId(productId);
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchHistory();
    }
  }, [productId]);

  return (
    <div className="inventory-history-sidebar">
      <div className="sidebar-header">
        <h3>Inventory History: {productName}</h3>
        <button onClick={onClose} className="close-btn">
          ×
        </button>
      </div>

      <div className="history-content">
        {loading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p>No inventory history found for this product.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Old Quantity</th>
                <th>New Quantity</th>
                <th>Changed By</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record._id}>
                  <td>{new Date(record.createdAt).toLocaleString()}</td>
                  <td>{record.oldQuantity}</td>
                  <td>{record.newQuantity}</td>
                  <td>{record.changedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryHistory;
