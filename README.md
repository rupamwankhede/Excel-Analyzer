# Excel Analyzer - MERN Stack Application

A comprehensive Excel data analysis web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Project Structure

```
├── frontend/              # React frontend application
│   ├── src/              # React components and source code
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
├── backend/              # Express.js backend server
│   ├── index.js         # Server entry point
│   ├── package.json     # Backend dependencies
│   └── uploads/         # File upload directory
└── package.json         # Root package.json for scripts
```

## Features

- **File Upload**: Support for .xlsx, .xls, and .csv files
- **Data Visualization**: Interactive charts and graphs using Recharts
- **Advanced Filtering**: Real-time search, column filtering, and sorting
- **Statistical Analysis**: Comprehensive data insights and correlations
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Data Export**: Export filtered data to CSV format

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- Vite for build tooling

### Backend
- Express.js server
- Multer for file upload handling
- XLSX for Excel file processing
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install-all
   ```

3. Start the development servers:
   ```bash
   npm run dev
   ```

This will start both the React frontend (port 5173) and Express backend (port 3001) concurrently.

### Individual Commands

To run frontend only:
```bash
npm run frontend
```

To run backend only:
```bash
npm run backend
```

## API Endpoints

- `POST /api/upload` - Upload and parse Excel files
- `POST /api/analyze` - Perform data analysis
- `POST /api/filter` - Filter and sort data
- `GET /api/health` - Health check endpoint

## Usage

1. **Upload File**: Drag and drop or select an Excel/CSV file
2. **View Data**: Browse your data in an interactive table
3. **Apply Filters**: Use the filter panel to search and sort data
4. **Analyze Data**: View statistical analysis and visualizations
5. **Export Results**: Download filtered data as CSV

## Features Overview

### Data Analysis
- Summary statistics for all columns
- Correlation analysis between numeric columns
- Trend analysis and insights
- Missing data detection

### Visualizations
- Bar charts for column averages
- Pie charts for categorical data distribution
- Correlation matrices with color coding

### Data Management
- Pagination for large datasets
- Real-time search across all columns
- Column-specific filtering
- Ascending/descending sorting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.# Excel-Analyzer
