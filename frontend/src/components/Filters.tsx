import React, { useState, useEffect } from "react";

interface FilterProps {
  data: any[];
  onFilter: (filtered: any[]) => void;
}

const Filter: React.FC<FilterProps> = ({ data, onFilter }) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data.length) {
      setColumns(Object.keys(data[0]));
      const initialFilters: Record<string, string> = {};
      Object.keys(data[0]).forEach((col) => {
        initialFilters[col] = "";
      });
      setFilters(initialFilters);
    }
  }, [data]);

  const handleChange = (column: string, value: string) => {
    const newFilters = { ...filters, [column]: value };
    setFilters(newFilters);

    // Apply filters dynamically
    const filtered = data.filter((row) =>
      Object.entries(newFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const cell = row[key];
        return (
          cell !== undefined &&
          String(cell).toLowerCase().includes(filterValue.toLowerCase())
        );
      })
    );

    onFilter(filtered);
  };

  const resetFilters = () => {
    const cleared = Object.keys(filters).reduce(
      (acc, key) => ({ ...acc, [key]: "" }),
      {}
    );
    setFilters(cleared);
    onFilter(data);
  };

  if (!data.length) return null;

  return (
    <div className="p-4 space-y-4 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
      <div className="flex flex-wrap gap-4">
        {columns.map((col) => (
          <div key={col} className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700 dark:text-gray-200">
              {col}
            </label>
            <input
              type="text"
              value={filters[col]}
              onChange={(e) => handleChange(col, e.target.value)}
              placeholder={`Filter ${col}`}
              className="px-3 py-2 text-gray-900 transition border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        ))}
      </div>
      <button
        onClick={resetFilters}
        className="px-4 py-2 mt-2 text-white transition rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filter;
