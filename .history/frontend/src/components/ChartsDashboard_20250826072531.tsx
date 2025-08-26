import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
} from "recharts";

interface ChartsDashboardProps {
  data: any[];
}

const chartTypes = [
  "Bar Chart",
  "Stacked Bar Chart",
  "Line Chart",
  "Area Chart",
  "Stacked Area Chart",
  "Pie Chart",
  "Donut Chart",
  "Radar Chart",
  "Radial Bar Chart",
  "Scatter Plot",
  "Composed Chart",
  "Treemap",
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c"];

const ChartsDashboard: React.FC<ChartsDashboardProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState("Bar Chart");

  if (!data || data.length === 0) return <div>No data available</div>;

  const getKey = (exclude: string[] = []) =>
    Object.keys(data[0]).find((k) => !exclude.includes(k)) || "value";

  const renderChart = () => {
    switch (activeChart) {
      case "Bar Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={getKey(["name"])} fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "Stacked Bar Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={getKey(["name"])} stackId="a" fill={COLORS[0]} />
              <Bar dataKey={getKey(["name", getKey(["name"])])} stackId="a" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "Line Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={getKey(["name"])} stroke={COLORS[0]} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "Area Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey={getKey(["name"])} stroke={COLORS[0]} fill={COLORS[1]} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "Stacked Area Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey={getKey(["name"])} stackId="1" stroke={COLORS[0]} fill={COLORS[0]} />
              <Area type="monotone" dataKey={getKey(["name", getKey(["name"])])} stackId="1" stroke={COLORS[1]} fill={COLORS[1]} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "Pie Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey={getKey(["name"])} nameKey="name" outerRadius={120} fill={COLORS[0]} label />
            </PieChart>
          </ResponsiveContainer>
        );
      case "Donut Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey={getKey(["name"])} nameKey="name" innerRadius={60} outerRadius={120} fill={COLORS[1]} label />
            </PieChart>
          </ResponsiveContainer>
        );
      case "Radar Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar dataKey={getKey(["name"])} stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        );
      case "Radial Bar Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart data={data} innerRadius="10%" outerRadius="80%" barSize={10}>
              <RadialBar dataKey={getKey(["name"])} fill={COLORS[1]} />
              <Legend />
            </RadialBarChart>
          </ResponsiveContainer>
        );
      case "Scatter Plot":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="x" name="X" />
              <YAxis dataKey="y" name="Y" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={data} fill={COLORS[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case "Composed Chart":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={getKey(["name"])} fill={COLORS[0]} />
              <Line type="monotone" dataKey={getKey(["name", getKey(["name"])])} stroke={COLORS[3]} />
            </ComposedChart>
          </ResponsiveContainer>
        );
      case "Treemap":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data.map((d) => ({ name: d.name, size: d.value || 100 }))}
              dataKey="size"
              stroke="#fff"
              fill={COLORS[0]}
            />
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {chartTypes.map((ct) => (
          <button
            key={ct}
            onClick={() => setActiveChart(ct)}
            className={`px-3 py-1 rounded-lg border text-sm ${
              activeChart === ct
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {ct}
          </button>
        ))}
      </div>

      <div className="w-full h-[500px] bg-white rounded-lg shadow-lg flex items-center justify-center p-4 dark:bg-gray-900">
        {renderChart()}
      </div>

      <h2 className="mt-4 text-lg font-bold text-center text-gray-700 dark:text-gray-200">
        {activeChart}
      </h2>
    </div>
  );
};

export default ChartsDashboard;

