import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  History,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Optimize Resume",
      path: "/optimize",
      icon: FileText,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },
    
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
      
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles size={18} />
          </div>

          <span className="text-sm font-bold text-slate-900">
            ATS Optimizer
          </span>
        </Link>
      </div>
      {/* Navigation */}
      <nav className="space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />

              <span>{item.name}</span>
            </Link>

            
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 w-full border-t border-slate-200 p-4">
        <div className="mb-3">
          <p className="truncate text-sm font-semibold text-slate-900">
            {user?.name || "User"}
          </p>

          <p className="truncate text-xs text-slate-500">
            {user?.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;