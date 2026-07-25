import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Receipt,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";
import TransactionsDataTable from "../../component/Transactions/TransactionsDataTable";
import TransactionsFilter from "../../component/TransactionsFilter/TransactionsFilter";

import type { Transaction } from "../../interfaces/transictionList";
import { pageAnimation, fadeInUp, staggerContainer } from "../../animations/PageAnimation";

interface ApiResponse {
  status: string;
  message: string;
  data: {
    data: Transaction[];
  };
}

type Filters = {
  device: string;
  sender: string;
  fromDate: string;
  toDate: string;
  type: string;
};

const initialFilters: Filters = {
  device: "",
  sender: "",
  fromDate: "",
  toDate: "",
  type: "",
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [devices, setDevices] = useState<string[]>([]);
  const [senders, setSenders] = useState<string[]>([]);

  const [newTransactionId, setNewTransactionId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const filtersRef = useRef<Filters>(initialFilters);
  const prevKeysRef = useRef<Set<string>>(new Set());
  const isFirstFetchRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getTransactionKey = (t: Transaction) =>
    `${t._id}-${t.sender}-${t.amount}-${t.date}-${t.device}-${t.type}`;

  const buildFilterOptions = (data: Transaction[]) => {
    const devicesList = Array.from(
      new Set(data.map((t) => t.device).filter(Boolean))
    );

    const sendersList = Array.from(
      new Set(data.map((t) => t.sender).filter(Boolean))
    );

    setDevices(devicesList);
    setSenders(sendersList);
  };

  const applyFilters = (data: Transaction[], filters: Filters) => {
    let filtered = [...data];

    if (filters.device) {
      filtered = filtered.filter((t) =>
        t.device.toLowerCase().includes(filters.device.toLowerCase())
      );
    }

    if (filters.sender) {
      filtered = filtered.filter((t) =>
        t.sender.toLowerCase().includes(filters.sender.toLowerCase())
      );
    }

    if (filters.fromDate) {
      filtered = filtered.filter(
        (t) => new Date(t.date) >= new Date(`${filters.fromDate}T00:00:00`)
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(
        (t) => new Date(t.date) <= new Date(`${filters.toDate}T23:59:59`)
      );
    }

    if (filters.type) {
      filtered = filtered.filter(
        (t) => t.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    return filtered;
  };

  const showNewTransactionEffect = (id: string) => {
    setNewTransactionId(id);
    setShowToast(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setNewTransactionId(null);
      setShowToast(false);
    }, 3500);
  };

  const fetchTransactions = async () => {
    try {
      const res = await axiosInstance.get<ApiResponse>("/message/recents");
      const newData = res.data.data.data;

      buildFilterOptions(newData);

      const currentKeys = new Set(newData.map(getTransactionKey));

      if (isFirstFetchRef.current) {
        prevKeysRef.current = currentKeys;
        isFirstFetchRef.current = false;
      } else {
        const newTransaction = newData.find(
          (t) => !prevKeysRef.current.has(getTransactionKey(t))
        );

        if (newTransaction) {
          showNewTransactionEffect(getTransactionKey(newTransaction));
        }

        prevKeysRef.current = currentKeys;
      }

      setTransactions(newData);
      setFilteredTransactions(applyFilters(newData, filtersRef.current));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters: Filters) => {
    filtersRef.current = newFilters;
    setFilteredTransactions(applyFilters(transactions, newFilters));
  };

  useEffect(() => {
    fetchTransactions();

    const interval = setInterval(fetchTransactions, 5000);

    return () => {
      clearInterval(interval);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const totalTransactions = filteredTransactions.length;

  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const receivedAmount = filteredTransactions
    .filter((t) => t.type === "received")
    .reduce((sum, t) => sum + t.amount, 0);

  const sentAmount = filteredTransactions
    .filter((t) => t.type === "sent")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative space-y-6"
    >
      {/* ── Header ── */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
              boxShadow: "0 8px 24px rgba(16,185,129,.3)",
            }}
          >
            <CreditCard size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Transactions</h1>
            <p className="text-[var(--text-secondary)] mt-0.5 text-sm">
              Monitor your latest payment activity
            </p>
          </div>
        </div>

        <Link
          to="/all-transactions"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium shadow-md transition-all hover:shadow-emerald-500/30 hover:-translate-y-0.5 text-sm"
          style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary))" }}
        >
          <span>View All Transactions</span>
          <ArrowRight size={16} />
        </Link>
      </motion.div>

      {/* ── Toast ── */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.9 }}
          className="fixed top-20 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2"
        >
          <span className="text-lg">💸</span>
          <span className="font-medium">New transaction received!</span>
        </motion.div>
      )}

      {/* ── Stats Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeInUp} className="stat-card stat-card-indigo card-hover flex items-center gap-3">
          <div className="icon-badge icon-badge-indigo">
            <Receipt size={18} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] font-medium">Transactions</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">
              {totalTransactions.toLocaleString()}
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="stat-card stat-card-violet card-hover flex items-center gap-3">
          <div className="icon-badge icon-badge-violet">
            <Wallet size={18} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] font-medium">Total Volume</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">
              {totalAmount.toLocaleString()}{" "}
              <span className="text-sm font-medium text-[var(--text-muted)]">EGP</span>
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="stat-card stat-card-green card-hover flex items-center gap-3">
          <div className="icon-badge icon-badge-emerald">
            <ArrowDownLeft size={18} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] font-medium">Received</p>
            <p className="text-xl font-bold text-emerald-600">
              {receivedAmount.toLocaleString()}
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="stat-card stat-card-rose card-hover flex items-center gap-3">
          <div className="icon-badge icon-badge-rose">
            <ArrowUpRight size={18} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] font-medium">Sent</p>
            <p className="text-xl font-bold text-rose-500">
              {sentAmount.toLocaleString()}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <TransactionsFilter
        devices={devices}
        senders={senders}
        onFilterChange={handleFilter}
      />

      <TransactionsDataTable
        data={filteredTransactions}
        newTransactionId={newTransactionId}
        loading={loading}
      />
    </motion.div>
  );
}