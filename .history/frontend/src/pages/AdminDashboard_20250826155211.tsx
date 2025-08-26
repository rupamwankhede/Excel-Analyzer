import React, { useState } from "react";
import {
  Users,
  FileSpreadsheet,
  BarChart3,
  Clock,
  Plus,
  Edit,
  Trash2,
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

// ---------------- Types ----------------
interface User {
  id: number;
  name: string;
  email: string;
}

interface FileItem {
  id: number;
  name: string;
  size: string;
}

interface AnalyticsItem {
  name: string;
  uploads: number;
}

type Tab = "overview" | "users" | "files" | "history";

// ---------------- Fake Data ----------------
const initialUsers: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

const initialFiles: FileItem[] = [
  { id: 1, name: "SalesReport.xlsx", size: "2MB" },
  { id: 2, name: "Inventory.xlsx", size: "3.5MB" },
];

const analyticsData: AnalyticsItem[] = [
  { name: "Mon", uploads: 12 },
  { name: "Tue", uploads: 18 },
  { name: "Wed", uploads: 9 },
  { name: "Thu", uploads: 22 },
  { name: "Fri", uploads: 15 },
];

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // ---------------- CRUD Functions ----------------
  const addUser = () => {
    const newUser: User = {
      id: Date.now(),
      name: `User${users.length + 1}`,
      email: `user${users.length + 1}@example.com`,
    };
    setUsers((prev) => [...prev, newUser]);
    setLogs((prev) => [`Added user: ${newUser.name}`, ...prev]);
  };

  const deleteUser = (id: number) => {
    const deleted = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (deleted) setLogs((prev) => [`Deleted user: ${deleted.name}`, ...prev]);
  };

  const addFile = () => {
    const newFile: FileItem = {
      id: Date.now(),
      name: `File${files.length + 1}.xlsx`,
      size: `${Math.floor(Math.random() * 5 + 1)}MB`,
    };
    setFiles((prev) => [...prev, newFile]);
    setLogs((prev) => [`Uploaded file: ${newFile.name}`, ...prev]);
  };

  const deleteFile = (id: number) => {
    const deleted = files.find((f) => f.id === id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (deleted) setLogs((prev) => [`Deleted file: ${deleted.name}`, ...prev]);
  };

  // ---------------- Render ----------------
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 text-white bg-gray-800">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1">
          {(["overview", "users", "files", "history"] as Tab[]).map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-4 cursor-pointer ${
                activeTab === tab ? "bg-gray-700" : ""
              }`}
            >
              {tab === "overview" && "Dashboard"}
              {tab === "users" && "Manage Users"}
              {tab === "files" && "Manage Files"}
              {tab === "history" && "History"}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 text-gray-900 bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        {/* -------- Overview -------- */}
        {activeTab === "overview" && (
          <>
            <h1 className="mb-6 text-2xl font-bold">Admin Overview</h1>
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
              <StatCard icon={<Users />} label="Users" value={users.length} />
              <StatCard
                icon={<FileSpreadsheet />}
                label="Files"
                value={files.length}
              />
              <StatCard icon={<BarChart3 />} label="Reports" value={5} />
              <StatCard icon={<Clock />} label="Logs" value={logs.length} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ChartCard title="Uploads Trend">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="uploads" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Uploads by Day">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uploads" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}

        {/* -------- Manage Users -------- */}
        {activeTab === "users" && (
          <div>
            <h1 className="mb-6 text-2xl font-bold">Manage Users</h1>
            <button
              onClick={addUser}
              className="flex items-center gap-2 px-4 py-2 mb-4 text-white bg-blue-600 rounded-lg"
            >
              <Plus size={16} /> Add User
            </button>
            <DataTable
              headers={["Name", "Email", "Actions"]}
              rows={users.map((u) => [
                u.name,
                u.email,
                <div key={u.id} className="flex gap-2">
                  <button className="p-2 text-white bg-yellow-500 rounded-lg">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2 text-white bg-red-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>,
              ])}
            />
          </div>
        )}

        {/* -------- Manage Files -------- */}
        {activeTab === "files" && (
          <div>
            <h1 className="mb-6 text-2xl font-bold">Manage Files</h1>
            <button
              onClick={addFile}
              className="flex items-center gap-2 px-4 py-2 mb-4 text-white bg-blue-600 rounded-lg"
            >
              <Plus size={16} /> Add File
            </button>
            <DataTable
              headers={["File Name", "Size", "Actions"]}
              rows={files.map((f) => [
                f.name,
                f.size,
                <div key={f.id} className="flex gap-2">
                  <button className="p-2 text-white bg-yellow-500 rounded-lg">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteFile(f.id)}
                    className="p-2 text-white bg-red-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>,
              ])}
            />
          </div>
        )}

        {/* -------- History -------- */}
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
      </main>
    </div>
  );
};

// ---------------- Reusable Components ----------------
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="p-6 bg-white shadow-md dark:bg-gray-800 rounded-xl">
    <div className="mb-2">{icon}</div>
    <p className="text-sm">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 bg-white shadow-md dark:bg-gray-800 rounded-xl">
    <h2 className="mb-4 text-lg font-bold">{title}</h2>
    {children}
  </div>
);

const DataTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: (React.ReactNode | string)[][];
}) => (
  <table className="w-full bg-white rounded-lg shadow-md dark:bg-gray-800">
    <thead>
      <tr className="text-left border-b dark:border-gray-700">
        {headers.map((h, i) => (
          <th key={i} className="p-3">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i} className="border-b dark:border-gray-700">
          {row.map((cell, j) => (
            <td key={j} className="p-3">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default AdminDashboard;
