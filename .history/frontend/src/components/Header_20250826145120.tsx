// import React from "react";
// import { Upload, Table, TrendingUp, BarChart3, FileDown } from "lucide-react";

// interface HeaderProps {
//   activeView: "upload" | "data" | "analysis" | "charts" | "export" | "login";
//   setActiveView: (view: HeaderProps["activeView"]) => void;
//   hasData: boolean;
//   data: any[];
//   user: { email: string } | null;
//   onLogout: () => void;
//   theme: string;
//   setTheme: (theme: string) => void;
// }

// const Header: React.FC<HeaderProps> = ({
//   activeView,
//   setActiveView,
//   hasData,
//   user,
//   onLogout,
//   theme,
//   setTheme,
// }) => {
//   if (!user) return null;

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md dark:border-gray-700">
//       <div className="container flex items-center justify-between h-16 px-4 mx-auto">
//         {/* Logo */}
//         <div
//           className="text-xl font-bold text-transparent cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text"
//           onClick={() => setActiveView("upload")}
//         >
//           Excel Analyzer
//         </div>

//         {/* Navigation */}
//         <nav className="flex items-center space-x-6">
//           <button
//             onClick={() => setActiveView("upload")}
//             className={`flex items-center space-x-1 ${
//               activeView === "upload"
//                 ? "text-blue-600 font-semibold"
//                 : "text-gray-600 dark:text-gray-300"
//             }`}
//           >
//             <Upload className="w-4 h-4" />
//             <span>Upload</span>
//           </button>

//           {hasData && (
//             <>
//               <button
//                 onClick={() => setActiveView("data")}
//                 className={`flex items-center space-x-1 ${
//                   activeView === "data"
//                     ? "text-blue-600 font-semibold"
//                     : "text-gray-600 dark:text-gray-300"
//                 }`}
//               >
//                 <Table className="w-4 h-4" />
//                 <span>Data</span>
//               </button>

//               <button
//                 onClick={() => setActiveView("analysis")}
//                 className={`flex items-center space-x-1 ${
//                   activeView === "analysis"
//                     ? "text-blue-600 font-semibold"
//                     : "text-gray-600 dark:text-gray-300"
//                 }`}
//               >
//                 <TrendingUp className="w-4 h-4" />
//                 <span>Analysis</span>
//               </button>

//               <button
//                 onClick={() => setActiveView("charts")}
//                 className={`flex items-center space-x-1 ${
//                   activeView === "charts"
//                     ? "text-blue-600 font-semibold"
//                     : "text-gray-600 dark:text-gray-300"
//                 }`}
//               >
//                 <BarChart3 className="w-4 h-4" />
//                 <span>Charts</span>
//               </button>

//               <button
//                 onClick={() => setActiveView("export")}
//                 className={`flex items-center space-x-1 ${
//                   activeView === "export"
//                     ? "text-blue-600 font-semibold"
//                     : "text-gray-600 dark:text-gray-300"
//                 }`}
//               >
//                 <FileDown className="w-4 h-4" />
//                 <span>Export</span>
//               </button>
//             </>
//           )}
//         </nav>

//         {/* Right side: Theme toggle + User */}
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//             className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//             title="Toggle theme"
//           >
//             {theme === "dark" ? "🌙" : "☀️"}
//           </button>

//           {user && (
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-700 dark:text-gray-300">
//                 {user.email}
//               </span>
//               <button
//                 onClick={onLogout}
//                 className="px-3 py-1 text-sm text-white transition rounded-md bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-md"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;





