const express = require('express');
const multer = require('multer');
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Generate basic statistics
    const stats = generateStatistics(jsonData);

    res.json({
      success: true,
      filename: req.file.originalname,
      data: jsonData,
      stats: stats,
      sheetNames: workbook.SheetNames
    });

    // Clean up uploaded file after processing
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }, 5000);

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

app.post('/api/analyze', (req, res) => {
  try {
    const { data, analysisType } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data provided' });
    }

    let result = {};

    switch (analysisType) {
      case 'summary':
        result = generateSummaryAnalysis(data);
        break;
      case 'correlation':
        result = generateCorrelationAnalysis(data);
        break;
      case 'trends':
        result = generateTrendAnalysis(data);
        break;
      default:
        result = generateStatistics(data);
    }

    res.json({ success: true, analysis: result });
  } catch (error) {
    console.error('Error analyzing data:', error);
    res.status(500).json({ error: 'Error analyzing data' });
  }
});

app.post('/api/filter', (req, res) => {
  try {
    const { data, filters } = req.body;
    
    let filteredData = [...data];

    // Apply filters
    if (filters.search) {
      filteredData = filteredData.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    if (filters.column && filters.value) {
      filteredData = filteredData.filter(row =>
        String(row[filters.column]).toLowerCase().includes(filters.value.toLowerCase())
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredData.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return filters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        } else {
          return filters.sortOrder === 'desc'
            ? String(bVal).localeCompare(String(aVal))
            : String(aVal).localeCompare(String(bVal));
        }
      });
    }

    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error('Error filtering data:', error);
    res.status(500).json({ error: 'Error filtering data' });
  }
});

// Helper functions
function generateStatistics(data) {
  if (!data || data.length === 0) return {};

  const stats = {
    totalRows: data.length,
    totalColumns: Object.keys(data[0] || {}).length,
    columns: {}
  };

  const columns = Object.keys(data[0] || {});
  
  columns.forEach(column => {
    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
    const numericValues = values.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));

    stats.columns[column] = {
      totalValues: values.length,
      nullCount: data.length - values.length,
      dataType: numericValues.length > values.length / 2 ? 'numeric' : 'text'
    };

    if (numericValues.length > 0) {
      stats.columns[column] = {
        ...stats.columns[column],
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        median: calculateMedian(numericValues)
      };
    }
  });

  return stats;
}

function generateSummaryAnalysis(data) {
  const summary = generateStatistics(data);
  const insights = [];

  // Generate insights
  if (data.length > 1000) {
    insights.push({ type: 'info', message: 'Large dataset detected - consider data optimization' });
  }

  Object.entries(summary.columns).forEach(([column, stats]) => {
    if (stats.nullCount > data.length * 0.1) {
      insights.push({ 
        type: 'warning', 
        message: `Column '${column}' has ${Math.round(stats.nullCount / data.length * 100)}% missing values` 
      });
    }
  });

  return { ...summary, insights };
}

function generateCorrelationAnalysis(data) {
  // Simple correlation analysis for numeric columns
  const numericColumns = [];
  const columns = Object.keys(data[0] || {});

  columns.forEach(column => {
    const values = data.map(row => row[column]);
    const numericValues = values.filter(val => !isNaN(parseFloat(val)));
    if (numericValues.length > data.length * 0.8) {
      numericColumns.push(column);
    }
  });

  const correlations = {};
  numericColumns.forEach(col1 => {
    correlations[col1] = {};
    numericColumns.forEach(col2 => {
      if (col1 !== col2) {
        correlations[col1][col2] = calculateCorrelation(data, col1, col2);
      }
    });
  });

  return { correlations, numericColumns };
}

function generateTrendAnalysis(data) {
  // Identify potential date columns and numeric trends
  const dateColumns = [];
  const numericColumns = [];
  const columns = Object.keys(data[0] || {});

  columns.forEach(column => {
    const values = data.map(row => row[column]);
    const numericValues = values.filter(val => !isNaN(parseFloat(val)));
    const dateValues = values.filter(val => !isNaN(Date.parse(val)));

    if (dateValues.length > values.length * 0.7) {
      dateColumns.push(column);
    } else if (numericValues.length > values.length * 0.7) {
      numericColumns.push(column);
    }
  });

  return {
    dateColumns,
    numericColumns,
    trends: numericColumns.map(column => ({
      column,
      trend: calculateTrend(data, column)
    }))
  };
}

function calculateMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function calculateCorrelation(data, col1, col2) {
  const pairs = data.map(row => [parseFloat(row[col1]), parseFloat(row[col2])])
    .filter(([a, b]) => !isNaN(a) && !isNaN(b));

  if (pairs.length < 2) return 0;

  const mean1 = pairs.reduce((sum, [a]) => sum + a, 0) / pairs.length;
  const mean2 = pairs.reduce((sum, [, b]) => sum + b, 0) / pairs.length;

  let num = 0, den1 = 0, den2 = 0;
  pairs.forEach(([a, b]) => {
    num += (a - mean1) * (b - mean2);
    den1 += (a - mean1) ** 2;
    den2 += (b - mean2) ** 2;
  });

  return den1 * den2 === 0 ? 0 : num / Math.sqrt(den1 * den2);
}

function calculateTrend(data, column) {
  const values = data.map((row, index) => [index, parseFloat(row[column])])
    .filter(([, val]) => !isNaN(val));

  if (values.length < 2) return 'insufficient_data';

  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));

  const avg1 = firstHalf.reduce((sum, [, val]) => sum + val, 0) / firstHalf.length;
  const avg2 = secondHalf.reduce((sum, [, val]) => sum + val, 0) / secondHalf.length;

  const change = (avg2 - avg1) / avg1;
  
  if (change > 0.1) return 'increasing';
  if (change < -0.1) return 'decreasing';
  return 'stable';
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});