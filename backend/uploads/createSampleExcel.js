const xlsx = require('xlsx');
const path = require('path');

// Sample data
const data = [
  { Name: 'Alice', Age: 25, Department: 'HR' },
  { Name: 'Bob', Age: 30, Department: 'Finance' },
  { Name: 'Charlie', Age: 28, Department: 'IT' }
];

// Convert to worksheet
const worksheet = xlsx.utils.json_to_sheet(data);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// Save Excel file in backend folder
const filePath = path.join(__dirname, 'sample.xlsx');
xlsx.writeFile(workbook, filePath);

console.log(`Sample Excel file created: ${filePath}`);
