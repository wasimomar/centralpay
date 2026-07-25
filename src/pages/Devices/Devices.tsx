import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Clock,
  ShieldCheck,
  X,
  Loader2,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import {
  pageAnimation,
  fadeInUp,
  staggerContainer,
} from "../../animations/PageAnimation";
import TransactionsDataTable from "../../component/Transactions/TransactionsDataTable";

type Device = {
  name: string;
  lastSyncDate: string;
};

type Transaction = {
  _id: string;
  sender: string;
  amount: number;
  date: string;
  type: "sent" | "received";
  device: string;
};

const cardVariants = {
  initial: { opacity: 0, y: 32, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ──────────────────────────────────────────────
   DELETE CONFIRMATION MODAL
────────────────────────────────────────────── */
function DeleteConfirmModal({
  device,
  onCancel,
  onConfirm,
  deleting,
}: {
  device: Device;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="delete-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={!deleting ? onCancel : undefined}
      />

      {/* Dialog */}
      <motion.div
        key="delete-dialog"
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-[70] inset-0 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-card)",
          }}
        >
          {/* Red top bar */}
          <div
            className="h-1.5 w-full"
            style={{
              background: "linear-gradient(90deg, #f43f5e, #fb7185)",
            }}
          />

          <div className="p-7">
            {/* Warning icon */}
            <div className="flex justify-center mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(244,63,94,0.1)" }}
              >
                <AlertTriangle size={32} color="#f43f5e" />
              </div>
            </div>

            {/* Title */}
            <h3
              className="text-xl font-bold text-center mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Delete Device
            </h3>

            {/* Device name chip */}
            <div className="flex justify-center mb-4">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(244,63,94,0.08)",
                  color: "#f43f5e",
                  border: "1px solid rgba(244,63,94,0.2)",
                }}
              >
                <Smartphone size={14} />
                {device.name}
              </span>
            </div>

            {/* Warning message */}
            <div
              className="rounded-2xl p-4 mb-6 text-sm leading-relaxed"
              style={{
                background: "rgba(244,63,94,0.06)",
                border: "1px solid rgba(244,63,94,0.15)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="font-semibold" style={{ color: "#f43f5e" }}>
                ⚠️ Warning:{" "}
              </span>
              This will permanently delete{" "}
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {device.name}
              </span>{" "}
              and{" "}
              <span className="font-semibold" style={{ color: "#f43f5e" }}>
                all transactions associated with this device
              </span>
              . This action cannot be undone.
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                id="delete-device-cancel-btn"
                onClick={onCancel}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:opacity-50"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-card)",
                  color: "var(--text-secondary)",
                }}
              >
                Cancel
              </button>

              <motion.button
                id="delete-device-confirm-btn"
                whileHover={!deleting ? { scale: 1.02 } : undefined}
                whileTap={!deleting ? { scale: 0.97 } : undefined}
                onClick={onConfirm}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                style={{
                  background: deleting
                    ? "rgba(244,63,94,0.6)"
                    : "linear-gradient(135deg, #f43f5e, #e11d48)",
                  boxShadow: deleting ? "none" : "0 4px 16px rgba(244,63,94,0.35)",
                }}
              >
                {deleting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Yes, Delete
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  // Transactions modal
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceTransactions, setDeviceTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  // Delete modal
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axiosInstance.get("/message/devices");
      setDevices(res.data.data.devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceClick = async (device: Device) => {
    setSelectedDevice(device);
    setTxLoading(true);
    setDeviceTransactions([]);
    try {
      const res = await axiosInstance.get(
        `/message/devices/${encodeURIComponent(device.name)}/messages`
      );
      const messages = res.data?.data?.messages ?? res.data?.data ?? [];
      setDeviceTransactions(messages);
    } catch (err) {
      console.error("Error fetching device transactions:", err);
      setDeviceTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedDevice(null);
    setDeviceTransactions([]);
  };

  /* ── Delete handlers ── */
  const handleDeleteClick = (e: React.MouseEvent, device: Device) => {
    e.stopPropagation(); // don't open the transactions modal
    setDeviceToDelete(device);
  };

  const handleDeleteConfirm = async () => {
    if (!deviceToDelete) return;
    setDeleting(true);
    const toastId = toast.loading(`Deleting ${deviceToDelete.name}…`);
    try {
      await axiosInstance.delete("/message/deleteDevice", {
        data: { deviceName: deviceToDelete.name },
      });
      toast.success("Device deleted successfully", { id: toastId });
      // Remove from local state
      setDevices((prev) => prev.filter((d) => d.name !== deviceToDelete.name));
      setDeviceToDelete(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete device";
      toast.error(msg, { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="p-10 min-h-screen" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="skeleton-shimmer h-8 w-48 rounded-lg mb-3" />
            <div className="skeleton-shimmer h-4 w-80 rounded-lg" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-[var(--bg-card)] rounded-3xl p-6 shadow-sm border border-[var(--border-card)]"
              >
                <div className="skeleton-shimmer w-16 h-16 rounded-2xl mb-6" />
                <div className="skeleton-shimmer h-6 w-40 rounded-lg mb-4" />
                <div className="h-px bg-[var(--border-card)] my-4" />
                <div className="skeleton-shimmer h-4 w-24 rounded-lg mb-3" />
                <div className="skeleton-shimmer h-5 w-44 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={pageAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-4 sm:p-6 lg:p-10 min-h-screen"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-10 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #34d399, #06b6d4)",
                boxShadow: "0 8px 24px rgba(52,211,153,.3)",
              }}
            >
              <Smartphone size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Your Devices</h1>
              <p className="text-[var(--text-secondary)] mt-0.5 text-sm">
                Click on any device to view its transactions
              </p>
            </div>
          </motion.div>

          {devices.length === 0 ? (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-[var(--bg-card)] rounded-3xl shadow-sm p-12 text-center border border-[var(--border-card)] text-[var(--text-primary)]"
            >
              <div
                className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl mb-6"
                style={{ background: "linear-gradient(135deg, #34d399, #06b6d4)" }}
              >
                <Smartphone size={30} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">No devices found</h2>
              <p className="text-[var(--text-secondary)] mt-2">
                Your connected devices will appear here once available.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {devices.map((device, index) => (
                <motion.div
                  key={`${device.name}-${device.lastSyncDate}-${index}`}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDeviceClick(device)}
                  className="group relative bg-[var(--bg-card)] rounded-3xl p-6 shadow-sm border border-[var(--border-card)] overflow-hidden cursor-pointer text-[var(--text-primary)] select-none"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  {/* Top gradient bar on hover */}
                  <div
                    className="absolute inset-x-0 top-0 h-1 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(90deg, var(--primary), var(--primary-light))",
                    }}
                  />

                  {/* Subtle hover overlay */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: "rgba(16,185,129,0.03)" }}
                  />

                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-16 h-16 flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: "linear-gradient(135deg, var(--bg-surface), var(--bg-card))",
                      }}
                    >
                      <Smartphone size={30} className="text-[var(--primary)]" />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          background: "rgba(16, 185, 129, 0.1)",
                          color: "var(--primary)",
                        }}
                      >
                        <ShieldCheck size={13} />
                        Synced
                      </span>
                      {/* Always visible on mobile, hover-only on sm+ */}
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: "var(--primary)" }}
                      >
                        <span className="sm:hidden">Tap to view</span>
                        <span className="hidden sm:inline">View Transactions</span>
                        <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-[var(--text-primary)]">{device.name}</h2>

                  <div className="h-px bg-[var(--border-card)] my-4" />

                  <div className="flex items-end justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold">
                        <Clock size={12} />
                        <span>Last Sync</span>
                      </div>
                      <p className="text-[var(--text-primary)] font-medium text-sm">
                        {new Date(device.lastSyncDate).toLocaleDateString("en-GB")}{" "}
                        <span className="text-[var(--text-muted)]">
                          •{" "}
                          {new Date(device.lastSyncDate).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    </div>

                    {/* ── DELETE BUTTON ── */}
                    <motion.button
                      id={`delete-device-btn-${index}`}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={(e) => handleDeleteClick(e, device)}
                      title="Delete device"
                      className="relative z-10 flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 cursor-pointer opacity-60 hover:opacity-100"
                      style={{
                        background: "rgba(244,63,94,0.08)",
                        border: "1px solid rgba(244,63,94,0.2)",
                        color: "#f43f5e",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(244,63,94,0.15)";
                        e.currentTarget.style.boxShadow = "0 0 12px rgba(244,63,94,0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(244,63,94,0.08)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Trash2 size={15} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deviceToDelete && (
          <DeleteConfirmModal
            device={deviceToDelete}
            deleting={deleting}
            onCancel={() => !deleting && setDeviceToDelete(null)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </AnimatePresence>

      {/* ── Device Transactions Modal ── */}
      <AnimatePresence>
        {selectedDevice && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-2 bottom-0 top-16 z-50 flex flex-col rounded-t-3xl overflow-hidden shadow-2xl sm:inset-x-4 md:inset-x-8 lg:inset-x-16 xl:inset-x-32"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                  borderColor: "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Smartphone size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedDevice.name}</h2>
                    <p className="text-white/70 text-xs">
                      Last sync:{" "}
                      {new Date(selectedDevice.lastSyncDate).toLocaleDateString("en-GB")}{" "}
                      {new Date(selectedDevice.lastSyncDate).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <button
                  id="close-device-modal-btn"
                  onClick={closeModal}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Modal body */}
              <div className="flex-1 overflow-y-auto p-6">
                {txLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2
                      size={40}
                      className="animate-spin"
                      style={{ color: "var(--primary)" }}
                    />
                    <p className="text-[var(--text-secondary)] font-medium">
                      Loading transactions for {selectedDevice.name}…
                    </p>
                  </div>
                ) : (
                  <TransactionsDataTable data={deviceTransactions} loading={false} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
