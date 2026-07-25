import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  User,
  BarChart3,
  Smartphone,
  List,
  Coins,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home", color: "#10b981" },
  { to: "/all-transactions", icon: List, label: "All Transactions", color: "#0d9488" },
  { to: "/analytics", icon: BarChart3, label: "Analytics", color: "#f59e0b" },
  { to: "/devices", icon: Smartphone, label: "Devices", color: "#06b6d4" },
  { to: "/profile", icon: User, label: "Profile", color: "#10b981" },
];

const sidebarVariants = {
  animate: {
    transition: { staggerChildren: 0.07, delayChildren: 0.25 },
  },
};

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

interface SidebarProps {
  onNavClick?: () => void;
}

export default function Sidebar({ onNavClick }: SidebarProps) {
  return (
    <div
      className="w-64 h-full overflow-y-auto border-r flex flex-col"
      style={{
        backgroundColor: "var(--bg-sidebar)",
        borderColor: "var(--border-sidebar)",
        color: "var(--text-sidebar)"
      }}
    >
      {/* Top label */}
      <div
        className="px-6 pt-5 pb-4 border-b"
        style={{ borderColor: "var(--border-sidebar)" }}
      >
        <div className="flex items-center gap-2">
          <Coins size={13} className="text-emerald-400" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Main Menu
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <motion.div
          variants={sidebarVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-1"
        >
          {navItems.map(({ to, icon: Icon, label, color }) => (
            <motion.div key={to} variants={itemVariants}>
              <NavLink to={to} onClick={onNavClick}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "text-white shadow-lg"
                        : "sidebar-item-adaptive"
                    }`}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(135deg, var(--primary-dark), var(--primary))",
                            boxShadow: "0 4px 15px rgba(16,185,129,.35)",
                          }
                        : {}
                    }
                  >
                    <Icon
                      size={18}
                      style={{ color: isActive ? "#fff" : color }}
                      className="flex-shrink-0 transition-colors"
                    />
                    <span className="font-medium text-sm tracking-wide">
                      {label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </div>
                )}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      </nav>

      {/* Footer */}
      <div
        className="px-6 py-4 border-t"
        style={{ borderColor: "var(--border-sidebar)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <p className="text-xs text-[var(--text-secondary)]">System Online</p>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">CentralPay v1.0</p>
      </div>
    </div>
  );
}