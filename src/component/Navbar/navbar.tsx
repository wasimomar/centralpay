import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, LayoutDashboard, LogOut, Coins, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return "dark"; // Default to dark mode
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setToken(storedToken);
  }, [location]);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "U";

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ backgroundColor: "var(--bg-navbar)" }}
      className="fixed top-0 left-0 w-full h-16 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 grid grid-cols-3 items-center z-50 pl-14 sm:pl-6"
    >
      {/* ── Left Column ── */}
      <div className="flex items-center justify-start">
        {token ? (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs font-semibold tracking-wider text-white uppercase">
              Secure Session
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5">
            <Coins size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-400 tracking-wide">
              CentralPay Gateway
            </span>
          </div>
        )}
      </div>

      {/* ── Center Column (Brand Logo) ── */}
      <div className="flex items-center justify-center">
        <div
          onClick={() => navigate(token ? "/dashboard" : "/")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow bg-white p-1">
            <img 
              src="/centralPay_Logo.jpeg" 
              alt="CentralPay Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[var(--text-primary)]">Central</span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #10b981, #f59e0b)",
              }}
            >
              Pay
            </span>
          </span>
        </div>
      </div>

      {/* ── Right Column ── */}
      <div className="flex items-center justify-end gap-3.5">
        {/* Theme Toggle Button — hidden on mobile, visible sm+ */}
        <button
          onClick={toggleTheme}
          className="hidden sm:flex p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-emerald-500/50 hover:bg-[var(--bg-table-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer items-center justify-center shadow-sm"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {token ? (
          <div className="relative" ref={dropdownRef}>
            <button
              id="navbar-user-menu"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-emerald-500/60 hover:bg-[var(--bg-table-hover)] transition-all duration-200 text-[var(--text-primary)] cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <span className="hidden xs:inline text-sm font-medium text-[var(--text-primary)] max-w-[80px] sm:max-w-[120px] truncate">
                {user?.name}
              </span>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-[var(--text-secondary)]" />
              </motion.div>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  id="navbar-dropdown"
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-52 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl shadow-2xl shadow-black/50 py-1.5 z-50 overflow-hidden text-[var(--text-primary)]"
                >
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-[var(--border-card)]">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      id="navbar-profile-btn"
                      onClick={() => { navigate("/profile"); setOpen(false); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--bg-table-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      <User size={15} className="text-emerald-400" />
                      <span className="text-sm">Profile</span>
                    </button>

                    <button
                      id="navbar-dashboard-btn"
                      onClick={() => { navigate("/dashboard"); setOpen(false); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--bg-table-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      <LayoutDashboard size={15} className="text-teal-400" />
                      <span className="text-sm">Dashboard</span>
                    </button>

                    {/* Theme toggle — mobile only */}
                    <button
                      id="navbar-theme-toggle-mobile"
                      onClick={() => { toggleTheme(); setOpen(false); }}
                      className="sm:hidden flex items-center gap-3 w-full text-left px-4 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--bg-table-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      {theme === "light" ? <Moon size={15} className="text-slate-400" /> : <Sun size={15} className="text-yellow-400" />}
                      <span className="text-sm">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                    </button>

                    <div className="my-1 border-t border-[var(--border-card)]" />

                    <button
                      id="navbar-logout-btn"
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </motion.nav>
  );
};

export default Navbar;