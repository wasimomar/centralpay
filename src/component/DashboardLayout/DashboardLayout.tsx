import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { Menu, X } from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "var(--bg-surface)", minHeight: "100vh" }}>
      {/* Mobile sidebar toggle button */}
      <button
        className="fixed top-4 left-4 z-[60] md:hidden p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-primary)] shadow-md cursor-pointer"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on md+, slide-in on mobile */}
      <div
        className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <Sidebar onNavClick={() => setSidebarOpen(false)} />
      </div>

      {/* Main content — offset only on md+ */}
      <div className="mt-16 md:ml-64 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;