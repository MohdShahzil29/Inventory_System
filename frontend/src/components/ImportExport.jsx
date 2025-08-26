import React, { useRef } from "react";
import { productAPI } from "../services/api";

const ImportExport = ({ onImportComplete }) => {
  const fileInputRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await productAPI.import(file);
      alert(
        `Import completed: ${response.data.imported} imported, ${response.data.skipped} skipped`
      );
      onImportComplete();
    } catch (error) {
      console.error("Import error:", error);
      alert(
        "Import failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleExport = async () => {
    try {
      const response = await productAPI.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export error:", error);
      alert(
        "Export failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="import-export">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".csv"
        style={{ display: "none" }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="import-btn"
      >
        Import CSV
      </button>
      <button onClick={handleExport} className="export-btn">
        Export CSV
      </button>
    </div>
  );
};

export default ImportExport;
