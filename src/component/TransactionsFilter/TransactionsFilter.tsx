import { useState } from "react";
import {
  Calendar,
  Smartphone,
  User,
  X,
  Filter,
  RotateCcw,
  ArrowUpDown,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";

interface Props {
  devices: string[];
  senders: string[];
  onFilterChange: (filters: {
    device: string;
    sender: string;
    fromDate: string;
    toDate: string;
    type: string;
  }) => void;
  onExportExcel?: (filters: {
    device: string;
    sender: string;
    fromDate: string;
    toDate: string;
    type: string;
  }) => void;
  isExporting?: boolean;
}

export default function TransactionsFilter({
  devices,
  senders,
  onFilterChange,
  onExportExcel,
  isExporting = false,
}: Props) {
  const [device, setDevice] = useState("");
  const [sender, setSender] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [type, setType] = useState("");

  const applyFilter = () => {
    onFilterChange({ device, sender, fromDate, toDate, type });
  };

  const resetFilter = () => {
    setDevice("");
    setSender("");
    setFromDate("");
    setToDate("");
    setType("");

    onFilterChange({
      device: "",
      sender: "",
      fromDate: "",
      toDate: "",
      type: "",
    });
  };

  const activeFilters = [
    device && { label: device, key: "device" },
    sender && { label: sender, key: "sender" },
    type && { label: `Type: ${type}`, key: "type" },
    (fromDate || toDate) && {
      label: `${fromDate || "?"} → ${toDate || "?"}`,
      key: "date",
    },
  ].filter(Boolean) as { label: string; key: string }[];

  const removeFilter = (key: string) => {
    const updatedFilters = {
      device: key === "device" ? "" : device,
      sender: key === "sender" ? "" : sender,
      fromDate: key === "date" ? "" : fromDate,
      toDate: key === "date" ? "" : toDate,
      type: key === "type" ? "" : type,
    };

    if (key === "device") setDevice("");
    if (key === "sender") setSender("");
    if (key === "type") setType("");
    if (key === "date") {
      setFromDate("");
      setToDate("");
    }

    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl shadow-xl p-5 space-y-4 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold text-sm">
        <Filter size={16} />
        Filters
      </div>

      {/* Filter Inputs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.6fr] gap-3">
        {/* Device */}
        <div className="flex items-center gap-2.5 h-11 border border-[var(--border-card)] bg-[var(--bg-surface)] px-3.5 rounded-xl shadow-sm hover:border-emerald-400 focus-within:border-emerald-400 transition-colors">
          <Smartphone size={15} className="text-emerald-500 shrink-0" />
          <select
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="outline-none bg-transparent text-sm text-[var(--text-primary)] cursor-pointer w-full"
          >
            <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Device</option>
            {devices.map((deviceName) => (
              <option key={deviceName} value={deviceName} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                {deviceName}
              </option>
            ))}
          </select>
        </div>

        {/* Sender */}
        <div className="flex items-center gap-2.5 h-11 border border-[var(--border-card)] bg-[var(--bg-surface)] px-3.5 rounded-xl shadow-sm hover:border-purple-400 focus-within:border-purple-400 transition-colors">
          <User size={15} className="text-purple-500 shrink-0" />
          <select
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="outline-none bg-transparent text-sm text-[var(--text-primary)] cursor-pointer w-full"
          >
            <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Sender</option>
            {senders.map((senderName) => (
              <option key={senderName} value={senderName} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                {senderName}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="flex items-center gap-2.5 h-11 border border-[var(--border-card)] bg-[var(--bg-surface)] px-3.5 rounded-xl shadow-sm hover:border-blue-400 focus-within:border-blue-400 transition-colors">
          <ArrowUpDown size={15} className="text-blue-500 shrink-0" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="outline-none bg-transparent text-sm text-[var(--text-primary)] cursor-pointer w-full"
          >
            <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Type</option>
            <option value="sent" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Sent</option>
            <option value="received" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Received</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2.5 h-11 border border-[var(--border-card)] bg-[var(--bg-surface)] px-3.5 rounded-xl shadow-sm hover:border-green-400 focus-within:border-green-400 transition-colors">
          <Calendar size={15} className="text-green-500 shrink-0" />
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-xs font-medium text-[var(--text-muted)] shrink-0">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="outline-none bg-transparent text-sm text-[var(--text-primary)] cursor-pointer w-full min-w-0"
            />
          </div>
          <div className="w-px h-4 bg-[var(--border-card)] shrink-0" />
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-xs font-medium text-[var(--text-muted)] shrink-0">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="outline-none bg-transparent text-sm text-[var(--text-primary)] cursor-pointer w-full min-w-0"
            />
          </div>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Active Filter Tags */}
        {activeFilters.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter.key}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-[var(--border-card)] bg-[var(--bg-table-hover)] text-[var(--text-primary)]"
              >
                {filter.label}
                <X
                  size={12}
                  className="cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() => removeFilter(filter.key)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2.5 sm:shrink-0">
          {onExportExcel && (
            <button
              onClick={() => onExportExcel({ device, sender, fromDate, toDate, type })}
              disabled={isExporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap"
            >
              {isExporting ? (
                <Loader2 size={15} className="animate-spin shrink-0" />
              ) : (
                <FileSpreadsheet size={15} className="shrink-0" />
              )}
              {isExporting ? "Exporting..." : "Export Excel"}
            </button>
          )}

          <button
            onClick={applyFilter}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Filter size={15} className="shrink-0" />
            Apply
          </button>

          <button
            onClick={resetFilter}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-surface)] hover:bg-[var(--bg-table-hover)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer whitespace-nowrap"
          >
            <RotateCcw size={15} className="shrink-0" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}