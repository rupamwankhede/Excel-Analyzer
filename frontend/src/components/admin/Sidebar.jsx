import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-4 font-bold text-xl border-b">Admin</div>
      <nav className="p-4 space-y-2">
        <Link to="/admin" className="block p-2 hover:bg-gray-100">Dashboard</Link>
        <Link to="/admin/users" className="block p-2 hover:bg-gray-100">Users</Link>
        <Link to="/admin/reports" className="block p-2 hover:bg-gray-100">Reports</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
