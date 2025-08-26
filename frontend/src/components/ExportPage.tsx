import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportPageProps {
  data: any[];
  filename: string;
}

const ExportPage: React.FC<ExportPageProps> = ({ data, filename }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center bg-white shadow-md dark:bg-gray-800 rounded-xl">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          No data available to export.
        </h2>
      </div>
    );
  }

  // Safe base name
  const baseName = filename ? filename.replace(/\.[^/.]+$/, "") : "export";

  // ✅ Export CSV
  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${baseName}.csv`;
    link.click();
  };

  // ✅ Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${baseName}.xlsx`);
  };

  // ✅ Export JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${baseName}.json`;
    link.click();
  };

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Exported Data", 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [Object.keys(data[0])],
      body: data.map((row) => Object.values(row)),
      styles: { fontSize: 8 },
    });

    doc.save(`${baseName}.pdf`);
  };

  return (
    <div className="p-8 transition-all duration-500 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Export Data
      </h2>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        Choose a format to download your filtered data.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <button
          onClick={exportCSV}
          className="px-4 py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-green-500 to-teal-600 hover:shadow-lg hover:-translate-y-1"
        >
          Export as CSV
        </button>

        <button
          onClick={exportExcel}
          className="px-4 py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:-translate-y-1"
        >
          Export as Excel
        </button>

        <button
          onClick={exportJSON}
          className="px-4 py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:shadow-lg hover:-translate-y-1"
        >
          Export as JSON
        </button>

        <button
          onClick={exportPDF}
          className="px-4 py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg hover:-translate-y-1"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default ExportPage;

