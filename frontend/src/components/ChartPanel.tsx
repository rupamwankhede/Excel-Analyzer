import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

interface Props {
  data: any[];
}

const ChartPanel: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;
  const sample = data[0];
  const cols = Object.keys(sample);
  // pick first numeric column and count categories in first non-numeric column
  const numericCols = cols.filter(c => data.every(r => r[c]===null || typeof r[c] === 'number'));
  const catCols = cols.filter(c => data.every(r => r[c]===null || typeof r[c] === 'string' || typeof r[c] === 'boolean'));

  const numeric = numericCols[0];
  const cat = catCols[0];

  const labels = cat ? Array.from(new Set(data.map(r=>String(r[cat]||'')))).slice(0,10) : data.slice(0,10).map((_,i)=>String(i+1));
  const values = labels.map(l => {
    const rows = data.filter(r => String(r[cat]||'') === l);
    if(!numeric) return rows.length;
    return rows.reduce((a,b)=> a + (typeof b[numeric] === 'number' ? b[numeric] : 0), 0);
  });

  const barData = {
    labels,
    datasets: [{ label: numeric ? `${numeric} by ${cat}` : `${cat} counts`, data: values }]
  };

  const lineData = {
    labels: data.slice(0,20).map((_,i)=>String(i+1)),
    datasets: [{
      label: numeric || 'values',
      data: data.slice(0,20).map(r => numeric ? (typeof r[numeric]==='number' ? r[numeric] : 0) : 1),
      fill: false,
    }]
  };

  const pieData = {
    labels,
    datasets: [{ data: values }]
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="font-semibold mb-2">Bar</h4>
        <Bar data={barData} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="font-semibold mb-2">Line</h4>
        <Line data={lineData} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="font-semibold mb-2">Pie</h4>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default ChartPanel;