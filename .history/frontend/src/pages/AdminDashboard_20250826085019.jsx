import React, { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import AnalyticsCard from "../components/admin/AnalyticsCard";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("/api/admin/summary", { headers: { "x-role": "admin" } })
      .then(res => res.json())
      .then(setSummary);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {summary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnalyticsCard title="Users" value={summary.totalUsers} />
            <AnalyticsCard title="Reports" value={summary.totalReports} />
            <AnalyticsCard title="Recent Report" value={summary.recentReports[0]?.name} />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
