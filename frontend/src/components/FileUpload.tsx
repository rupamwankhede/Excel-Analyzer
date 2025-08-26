import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { ExcelData } from '../App';

interface FileUploadProps {
  onDataUpload: (data: ExcelData) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataUpload, loading, setLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      
      if (result.success) {
        onDataUpload({
          data: result.data,
          stats: result.stats,
          filename: result.filename,
          sheetNames: result.sheetNames
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={handleChange}
          disabled={loading}
        />
        
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            dragActive ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <FileSpreadsheet className={`w-8 h-8 ${
                dragActive ? 'text-blue-600' : 'text-gray-600'
              }`} />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {loading ? 'Processing file...' : 'Upload your Excel file'}
            </h3>
            <p className="text-gray-600">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports .xlsx, .xls, and .csv files (max 10MB)
            </p>
          </div>
          
          <button
            type="button"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5 mr-2" />
            {loading ? 'Processing...' : 'Choose File'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <p className="text-blue-800 font-medium mb-2">What you can do with your data:</p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• View and filter your data in an interactive table</li>
              <li>• Generate statistical analysis and insights</li>
              <li>• Create visualizations and charts</li>
              <li>• Export processed data in various formats</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;