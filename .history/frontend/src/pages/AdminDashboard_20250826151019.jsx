import React, { useState } from "react";
import {
  Users,
  FileSpreadsheet,
  BarChart3,
  Clock,
  Plus,
  Edit,
  Trash2,
  Menu,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Fake data
const userData = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

const fileData = [
  { id: 1, name: "SalesReport.xlsx", size: "2MB" },
  { id: 2, name: "Inventory.xlsx", size: "3.5MB" },
];

const analyticsData = [
  { name: "Mon", uploads: 12 },
  { name: "Tue", uploads: 18 },
  { name: "Wed", uploads: 9 },
  { name: "Thu", uploads: 22 },
  { name: "Fri", uploads: 15 },
];

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState(userData);
  const [files, setFiles] = useState(fileData);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  // CRUD Handlers
  const addUser = () => {
    const newUser = {
      id: users.length + 1,
      name: `User${users.length + 1}`,
      email: `user${users.length + 1}@example.com`,
    };
    setUsers([...users, newUser]);
    setLogs([`Added new user: ${newUser.name}`, ...logs]);
  };

  const deleteUser = (id: number) => {
    const deleted = users.find((u) => u.id === id);
    setUsers(users.filter((u) => u.id !== id));
    setLogs([`Deleted user: ${deleted?.name}`, ...logs]);
  };

  const addFile = () => {
    const newFile = {
      id: files.length + 1,
      name: `File${files.length + 1}.xlsx`,
      size: `${Math.round(Math.random() * 5 + 1)}MB`,
    };
    setFiles([...files, newFile]);
    setLogs([`Uploaded file: ${newFile.name}`, ...logs]);
  };

  const deleteFile = (id: number) => {
    const deleted = files.find((f) => f.id === id);
    setFiles(files.filter((f) => f.id !== id));
    setLogs([`Deleted file: ${deleted?.name}`, ...logs]);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 text-white bg-gray-800">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1">
          <ul>
            <li
              className={`p-4 cursor-pointer ${
                activeTab === "overview" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Dashboard
            </li>
            <li
              className={`p-4 cursor-pointer ${
                activeTab === "users" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              Manage Users
            </li>
            <li
              className={`p-4 cursor-pointer ${
                activeTab === "files" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("files")}
            >
              Manage Files
            </li>
            <li
              className={`p-4 cursor-pointer ${
                activeTab === "history" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 text-gray-900 bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        {activeTab === "overview" && (
          <>
            <h1 className="mb-6 text-2xl font-bold">Admin Overview</h1>
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
              <div className="p-6 bg-white shadow-md dark:bg-gray-800 rounded-xl">
                <Users className="mb-2" />
                <p className="text-sm">Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="p-6 bg-white shadow-md dark:bg-gray-800 rounded-xl">
                <FileSpreadsheet className="mb-2" />
                <p className="text-sm">Files</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
              <div className="p-6 bg-white shadow-md dark:bg-gray-800 rounded-xl">
                <BarChart3 className="mb-2" />
                <p className="text-sm">Reports</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="p-6 bg-white shadow-md dark:bg-gray-800 rounded-xl">
                <Clock className="mb-2" />
                <p className="text-sm">Logs</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 bg-white shadow-md dark:bg-gray-800 rounded-xl">
                <h2 className="mb-4 text-lg font-bold">Uploads Trend</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="uploads" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="p-6 bg-white shadow-md dark:bg-gray-800 rounded-xl">
                <h2 className="mb-4 text-lg font-bold">Uploads by Day</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uploads" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <div>
            <h1 className="mb-6 text-2xl font-bold">Manage Users</h1>
            <button
              onClick={addUser}
              className="flex items-center gap-2 px-4 py-2 mb-4 text-white bg-blue-600 rounded-lg"
            >
              <Plus size={16} /> Add User
            </button>
            <table className="w-full bg-white rounded-lg shadow-md dark:bg-gray-800">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b dark:border-gray-700">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="flex gap-2 p-3">
                      <button className="p-2 text-white bg-yellow-500 rounded-lg">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-2 text-white bg-red-600 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "files" && (
          <div>
            <h1 className="mb-6 text-2xl font-bold">Manage Files</h1>
            <button
              onClick={addFile}
              className="flex items-center gap-2 px-4 py-2 mb-4 text-white bg-blue-600 rounded-lg"
            >
              <Plus size={16} /> Add File
            </button>
            <table className="w-full bg-white rounded-lg shadow-md dark:bg-gray-800">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="p-3">File Name</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.id} className="border-b dark:border-gray-700">
                    <td className="p-3">{f.name}</td>
                    <td className="p-3">{f.size}</td>
                    <td className="flex gap-2 p-3">
                      <button className="p-2 text-white bg-yellow-500 rounded-lg">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteFile(f.id)}
                        className="p-2 text-white bg-red-600 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h1 className="mb-6 text-2xl font-bold">History Logs</h1>
            <ul className="space-y-2">
              {logs.map((log, i) => (
                <li
                  key={i}
                  className="p-3 bg-white rounded-lg shadow-md dark:bg-gray-800"
                >
                  {log}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


