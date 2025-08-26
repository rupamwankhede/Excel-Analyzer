// import React, { useState, useEffect } from "react";
// import Header from "./components/Header";
// import Login from "./components/Login";
// import FileUpload from "./components/FileUpload";
// import DataTable from "./components/DataTable";
// import AnalysisDashboard from "./components/AnalysisDashboard";
// import ChartsDashboard from "./components/ChartsDashboard";
// import Filter from "./components/Filters";
// import AllInsights from "./components/AIInsights";
// import ExportPage from "./components/ExportPage"; 
// import AdminDashboard from "./pages/AdminDashboard";

// export interface ExcelData {
//   data: any[];
//   stats: {
//     totalRows: number;
//     totalColumns: number;
//   };
//   filename: string;
//   sheetNames: string[];
// }

// const App: React.FC = () => {
//   const [user, setUser] = useState<{ email: string } | null>(null);
//   const [excelData, setExcelData] = useState<ExcelData | null>(null);
//   const [filteredData, setFilteredData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [activeView, setActiveView] = useState<
//     "login" | "upload" | "data" | "analysis" | "charts" | "export" | "admin"
//   >("login");
//   const [theme, setTheme] = useState<"light" | "dark">(
//     (localStorage.getItem("xa_theme") as "light" | "dark") || "light"
//   );

//   /** -------------------------------
//    * Theme persistence
//    --------------------------------*/
//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", theme === "dark");
//     localStorage.setItem("xa_theme", theme);
//   }, [theme]);

//   /** -------------------------------
//    * Load user if exists
//    --------------------------------*/
//   useEffect(() => {
//     const stored = localStorage.getItem("xa_user");
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored);
//         if (parsed.email) {
//           setUser({ email: parsed.email });
//           setActiveView("upload"); // default after login
//         }
//       } catch {
//         console.warn("Failed to parse user from localStorage");
//       }
//     }
//   }, []);

//   /** -------------------------------
//    * Handlers
//    --------------------------------*/
//   const handleLogin = (email: string) => {
//     localStorage.setItem("xa_user", JSON.stringify({ email }));
//     setUser({ email });
//     setActiveView("upload");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("xa_user");
//     setUser(null);
//     setExcelData(null);
//     setFilteredData([]);
//     setActiveView("login");
//   };

//   const handleDataUpload = (data: ExcelData) => {
//     setExcelData(data);
//     setFilteredData(data.data);
//     setActiveView("data");
//   };

//   const handleFilteredData = (data: any[]) => setFilteredData(data);

//   /** -------------------------------
//    * If not logged in → only Login
//    --------------------------------*/
//   if (!user) {
//     return (
//       <div
//         className={`min-h-screen flex items-center justify-center ${
//           theme === "dark"
//             ? "bg-gray-900"
//             : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"
//         }`}
//       >
//         <Login onLogin={handleLogin} />
//       </div>
//     );
//   }

//   /** -------------------------------
//    * Main layout
//    --------------------------------*/
//   return (
//     <div
//       className={`${
//         theme === "dark"
//           ? "bg-gray-900 text-white"
//           : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"
//       } min-h-screen transition-all duration-500`}
//     >
//       {/* Header */}
//       <Header
//         activeView={activeView}
//         setActiveView={setActiveView}
//         hasData={!!excelData}
//         data={excelData?.data || []}
//         user={user}
//         onLogout={handleLogout}
//         theme={theme}
//         setTheme={setTheme}
//       />

//       <main className="container px-4 py-8 mx-auto space-y-8">
//         {/* ✅ Admin Dashboard */}
//         {activeView === "admin" && <AdminDashboard />}

//         {/* ✅ Upload */}
//         {activeView === "upload" && (
//           <div className="max-w-4xl mx-auto">
//             <div className="mb-12 text-center">
//               <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
//                 Excel Data Analyzer
//               </h1>
//               <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
//                 Upload, analyze, and visualize your Excel data with advanced insights
//               </p>
//             </div>

//             <FileUpload
//               onDataUpload={handleDataUpload}
//               loading={loading}
//               setLoading={setLoading}
//             />

//             {excelData && (
//               <div className="p-8 mt-12 transition-all duration-500 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
//                 <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
//                   Quick Overview
//                 </h2>
//                 <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//                   <div className="p-6 text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
//                     <h3 className="mb-2 text-lg font-semibold">Total Rows</h3>
//                     <p className="text-3xl font-bold">
//                       {excelData.stats.totalRows.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="p-6 text-white rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
//                     <h3 className="mb-2 text-lg font-semibold">Total Columns</h3>
//                     <p className="text-3xl font-bold">{excelData.stats.totalColumns}</p>
//                   </div>
//                   <div className="p-6 text-white rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
//                     <h3 className="mb-2 text-lg font-semibold">File Name</h3>
//                     <p className="text-lg font-semibold truncate">{excelData.filename}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ✅ Data / Analysis / Charts / Export */}
//         {(activeView === "data" ||
//           activeView === "analysis" ||
//           activeView === "charts" ||
//           activeView === "export") &&
//           excelData && (
//             <div className="space-y-6">
//               {/* Filter */}
//               <div className="p-4 transition-all duration-500 bg-white shadow-md dark:bg-gray-800 rounded-xl">
//                 <Filter data={excelData.data} onFilter={handleFilteredData} />
//               </div>

//               {activeView === "data" && (
//                 <DataTable
//                   data={filteredData}
//                   originalData={excelData.data}
//                   filename={excelData.filename}
//                 />
//               )}

//               {activeView === "analysis" && (
//                 <>
//                   <AnalysisDashboard data={filteredData} stats={excelData.stats} />
//                   <AllInsights data={filteredData} />
//                 </>
//               )}

//               {activeView === "charts" && (
//                 <ChartsDashboard data={filteredData} stats={excelData.stats} />
//               )}

//               {activeView === "export" && (
//                 <ExportPage data={filteredData} filename={excelData.filename} />
//               )}
//             </div>
//           )}
//       </main>
//     </div>
//   );
// };

// export default App;
