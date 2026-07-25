import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  Receipt,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";
import TransactionsDataTable from "../../component/Transactions/TransactionsDataTable";
import TransactionsFilter from "../../component/TransactionsFilter/TransactionsFilter";

import type { Transaction } from "../../interfaces/transictionList";
import { pageAnimation, fadeInUp, staggerContainer } from "../../animations/PageAnimation";

interface FiltersApiResponse {
  status: string;
  message: string;
  data: {
    filters: {
      device: string[];
      sender: string[];
    };
    transactions: number;
    sentCount: number;
    receivedCount: number;
    total: number;
    messages: Transaction[];
  };
}

type ActiveFilters = {
  device: string;
  sender: string;
  fromDate: string;
  toDate: string;
  type: string;
};

const initialFilters: ActiveFilters = {
  device: "",
  sender: "",
  fromDate: "",
  toDate: "",
  type: "",
};

const getTransactionKey = (t: Transaction) =>
  `${t._id}-${t.sender}-${t.amount}-${t.date}-${t.device}-${t.type}`;

export default function AllTransactions() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Stats from API
  const [apiStats, setApiStats] = useState({
    transactions: 0,
    sentCount: 0,
    receivedCount: 0,
    total: 0,
  });

  // Filter options from API
  const [devices, setDevices] = useState<string[]>([]);
  const [senders, setSenders] = useState<string[]>([]);

  // Current active filters
  const [filters, setFilters] = useState<ActiveFilters>(initialFilters);

  // New transaction detection (same as Dashboard)
  const [newTransactionId, setNewTransactionId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const prevKeysRef = useRef<Set<string>>(new Set());
  const isFirstFetchRef = useRef(true);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track whether filters are active (not default)
  const filtersRef = useRef<ActiveFilters>(initialFilters);

  const showNewTransactionEffect = (id: string) => {
    setNewTransactionId(id);
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setNewTransactionId(null);
      setShowToast(false);
    }, 3500);
  };

  const fetchFiltersData = async (activeFilters: ActiveFilters, isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      const params = {
        device: activeFilters.device,
        from: activeFilters.fromDate,
        to: activeFilters.toDate,
        sender: activeFilters.sender,
        amount: "",
        type: activeFilters.type,
      };

      const res = await axiosInstance.get<FiltersApiResponse>("/message/filters", { params });
      const responseData = res.data.data;

      setDevices(responseData.filters?.device ?? []);
      setSenders(responseData.filters?.sender ?? []);

      setApiStats({
        transactions: responseData.transactions ?? 0,
        sentCount: responseData.sentCount ?? 0,
        receivedCount: responseData.receivedCount ?? 0,
        total: responseData.total ?? 0,
      });

      const messages = responseData.messages ?? [];

      // Detect new transactions (only when no filters are active to avoid false positives)
      const noFiltersActive =
        !activeFilters.device &&
        !activeFilters.sender &&
        !activeFilters.fromDate &&
        !activeFilters.toDate &&
        !activeFilters.type;

      if (noFiltersActive) {
        const currentKeys = new Set(messages.map(getTransactionKey));
        if (isFirstFetchRef.current) {
          prevKeysRef.current = currentKeys;
          isFirstFetchRef.current = false;
        } else {
          const newTx = messages.find((t) => !prevKeysRef.current.has(getTransactionKey(t)));
          if (newTx) showNewTransactionEffect(getTransactionKey(newTx));
          prevKeysRef.current = currentKeys;
        }
      }

      setAllTransactions(messages);
    } catch (error) {
      console.error("Error fetching filtered transactions:", error);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const handleExportExcel = async (exportFilters: ActiveFilters) => {
    setIsExporting(true);
    try {
      const params = {
        device: exportFilters.device,
        from: exportFilters.fromDate,
        to: exportFilters.toDate,
        sender: exportFilters.sender,
        amount: "",
        type: exportFilters.type,
      };

      const response = await axiosInstance.get("/message/excelSheet", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Transactions_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel sheet:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilter = (newFilters: ActiveFilters) => {
    filtersRef.current = newFilters;
    setFilters(newFilters);
  };

  // Initial fetch + polling every 5 s (like Dashboard)
  useEffect(() => {
    fetchFiltersData(filters);

    const interval = setInterval(() => {
      fetchFiltersData(filtersRef.current, true);
    }, 5000);

    return () => {
      clearInterval(interval);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchFiltersData(filters);
  }, [filters]);

  return (
    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 sm:p-6 lg:p-10 min-h-screen space-y-6"
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      {/* ── New Transaction Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2"
          >
            <span className="text-lg">💸</span>
            <span className="font-medium">New transaction received!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
              boxShadow: "0 8px 24px rgba(16,185,129,.3)",
            }}
          >
            <List size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">All Transactions</h1>
            <p className="text-[var(--text-secondary)] mt-0.5 text-sm">Filter and view history of all payments</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div variants={fadeInUp} className="stat-card stat-card-indigo card-hover flex items-center gap-3">
            <div className="icon-badge icon-badge-indigo"><Receipt size={18} /></div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Transactions</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">
                {apiStats.transactions.toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="stat-card stat-card-violet card-hover flex items-center gap-3">
            <div className="icon-badge icon-badge-violet"><Wallet size={18} /></div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Total Volume</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">
                {apiStats.total.toLocaleString()}
                <span className="text-sm font-medium text-[var(--text-muted)] ml-1">EGP</span>
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="stat-card stat-card-green card-hover flex items-center gap-3">
            <div className="icon-badge icon-badge-emerald"><ArrowDownLeft size={18} /></div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Received</p>
              <p className="text-xl font-bold text-emerald-600">
                {apiStats.receivedCount.toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="stat-card stat-card-rose card-hover flex items-center gap-3">
            <div className="icon-badge icon-badge-rose"><ArrowUpRight size={18} /></div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Sent</p>
              <p className="text-xl font-bold text-rose-500">
                {apiStats.sentCount.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <TransactionsFilter
          devices={devices}
          senders={senders}
          onFilterChange={handleFilter}
          onExportExcel={handleExportExcel}
          isExporting={isExporting}
        />

        {/* Table */}
        <TransactionsDataTable
          data={allTransactions}
          newTransactionId={newTransactionId}
          loading={loading}
        />
      </div>
    </motion.div>
  );
}
