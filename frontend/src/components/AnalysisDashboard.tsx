import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface AnalysisDashboardProps {
  data: any[];
  stats: any;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, stats }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeAnalysis, setActiveAnalysis] = useState('summary');
  const [loading, setLoading] = useState(false);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  const performAnalysis = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, analysisType: type }),
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysis(result.analysis);
      }
    } catch (error) {
      console.error('Error performing analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performAnalysis(activeAnalysis);
  }, [activeAnalysis, data]);

  const getChartData = () => {
    if (!data.length) return [];
    
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => {
      const values = data.map(row => row[col]).filter(val => !isNaN(parseFloat(val)));
      return values.length > data.length * 0.7;
    });

    if (numericColumns.length === 0) return [];

    return numericColumns.slice(0, 6).map(col => ({
      name: col,
      value: data.reduce((sum, row) => sum + (parseFloat(row[col]) || 0), 0) / data.length,
      count: data.filter(row => row[col] != null && row[col] !== '').length
    }));
  };

  const getPieChartData = () => {
    if (!data.length) return [];
    
    const columns = Object.keys(data[0]);
    const textColumn = columns.find(col => {
      const uniqueValues = [...new Set(data.map(row => row[col]))];
      return uniqueValues.length < 20 && uniqueValues.length > 1;
    });

    if (!textColumn) return [];

    const valueCounts = data.reduce((acc, row) => {
      const value = row[textColumn] || 'Unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(valueCounts)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  };

  const renderInsights = () => {
    if (!analysis || !analysis.insights) return null;

    return (
      <div className="space-y-4">
        {analysis.insights.map((insight: any, index: number) => {
          const Icon = insight.type === 'warning' ? AlertTriangle : 
                     insight.type === 'info' ? Info : CheckCircle;
          const colorClass = insight.type === 'warning' ? 'text-orange-600 bg-orange-50 border-orange-200' :
                            insight.type === 'info' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                            'text-green-600 bg-green-50 border-green-200';

          return (
            <div key={index} className={`p-4 rounded-lg border ${colorClass}`}>
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 mt-0.5" />
                <p className="font-medium">{insight.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCorrelationMatrix = () => {
    if (!analysis || !analysis.correlations) return null;

    const { correlations, numericColumns } = analysis;

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50"></th>
              {numericColumns.map((col: string) => (
                <th key={col} className="border border-gray-300 p-2 bg-gray-50 text-xs">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {numericColumns.map((row: string) => (
              <tr key={row}>
                <td className="border border-gray-300 p-2 bg-gray-50 font-medium text-xs">
                  {row}
                </td>
                {numericColumns.map((col: string) => {
                  const correlation = row === col ? 1 : correlations[row]?.[col] || 0;
                  const intensity = Math.abs(correlation);
                  const color = correlation > 0 ? 'bg-blue-500' : 'bg-red-500';
                  
                  return (
                    <td
                      key={col}
                      className="border border-gray-300 p-2 text-center relative"
                    >
                      <div
                        className={`absolute inset-0 ${color}`}
                        style={{ opacity: intensity * 0.7 }}
                      ></div>
                      <span className="relative text-xs font-medium text-white mix-blend-difference">
                        {correlation.toFixed(2)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const chartData = getChartData();
  const pieData = getPieChartData();

  return (
    <div className="space-y-8">
      {/* Analysis Type Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Analysis Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'summary', label: 'Summary', icon: BarChart3 },
            { id: 'correlation', label: 'Correlation', icon: Activity },
            { id: 'trends', label: 'Trends', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveAnalysis(id)}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeAnalysis === id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing data...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Rows</h3>
              <p className="text-3xl font-bold">{stats.totalRows.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Columns</h3>
              <p className="text-3xl font-bold">{stats.totalColumns}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Numeric Columns</h3>
              <p className="text-3xl font-bold">
                {Object.values(stats.columns).filter((col: any) => col.dataType === 'numeric').length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Text Columns</h3>
              <p className="text-3xl font-bold">
                {Object.values(stats.columns).filter((col: any) => col.dataType === 'text').length}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {chartData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Column Averages</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {pieData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Value Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-8">
              {activeAnalysis === 'summary' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Data Insights</h3>
                  {renderInsights()}
                </div>
              )}

              {activeAnalysis === 'correlation' && analysis.correlations && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Correlation Matrix</h3>
                  <p className="text-gray-600 mb-4">
                    Values range from -1 (negative correlation) to 1 (positive correlation)
                  </p>
                  {renderCorrelationMatrix()}
                </div>
              )}

              {activeAnalysis === 'trends' && analysis.trends && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Trend Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysis.trends.map((trend: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{trend.column}</h4>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          trend.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                          trend.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {trend.trend === 'increasing' && <TrendingUp className="w-4 h-4 mr-1" />}
                          {trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalysisDashboard;