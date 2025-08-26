import React, { useState, useEffect } from 'react';
import { Filter, X, Search, SortAsc, SortDesc } from 'lucide-react';

interface FilterPanelProps {
  data: any[];
  onFilteredData: (data: any[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ data, onFilteredData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    column: '',
    value: '',
    sortBy: '',
    sortOrder: 'asc' as 'asc' | 'desc'
  });

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const applyFilters = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, filters }),
      });

      if (response.ok) {
        const result = await response.json();
        onFilteredData(result.data);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      column: '',
      value: '',
      sortBy: '',
      sortOrder: 'asc'
    });
    onFilteredData(data);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters & Sorting</span>
          <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ↓
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Global Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search across all columns..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Column Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Column
              </label>
              <select
                value={filters.column}
                onChange={(e) => setFilters(prev => ({ ...prev, column: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select column...</option>
                {columns.map(column => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Value
              </label>
              <input
                type="text"
                placeholder="Enter filter value..."
                value={filters.value}
                onChange={(e) => setFilters(prev => ({ ...prev, value: e.target.value }))}
                disabled={!filters.column}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by Column
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No sorting</option>
                {columns.map(column => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                  disabled={!filters.sortBy}
                  className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-lg transition-all duration-200 ${
                    filters.sortOrder === 'asc'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <SortAsc className="w-4 h-4 mr-1" />
                  Ascending
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                  disabled={!filters.sortBy}
                  className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-lg transition-all duration-200 ${
                    filters.sortOrder === 'desc'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <SortDesc className="w-4 h-4 mr-1" />
                  Descending
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={resetFilters}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;