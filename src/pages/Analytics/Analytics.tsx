import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  FileText,
  Download,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { pageAnimation, fadeInUp, staggerContainer } from "../../animations/PageAnimation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Transaction } from "../../interfaces/transictionList";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type TopLeast = {
  name: string;
  transactions: number;
  totalAmount: number;
  percentage: number;
};

type AnalyticsResponse = {
  topUsed: TopLeast[];
  leastUsed: TopLeast[];
  usageBreakdown: Record<string, number>;
};

interface ForecastPoint {
  Time: string;
  pred_amount: number;
  pred_count: number;
}

interface ForecastSegment {
  type: string;
  steps: number;
  forecast: ForecastPoint[];
}

interface ForecastResponse {
  sent: ForecastSegment;
  received: ForecastSegment;
  sent_count: number;
  received_count: number;
}

type UserType = {
  name: string;
  email: string;
};

const COLORS = ["#6366f1", "#06b6d4", "#f43f5e", "#10b981", "#8b5cf6", "#f59e0b"];

const formatNumber = (num: number) => {
  const abs = Math.abs(num);
  let result = "";
  if (abs >= 1_000_000) result = `${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  else if (abs >= 1_000) result = `${(abs / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  else result = abs.toFixed(0);
  return num < 0 ? `-${result}` : result;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const buildForecastLabel = (timeVal: string, index: number): string => {
  if (!timeVal) return `H${index + 1}`;
  try {
    const d = new Date(timeVal);
    if (isNaN(d.getTime())) return `H${index + 1}`;
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const day = d.getDate();
    const month = months[d.getMonth()];
    return `${day} ${month}, ${hh}:${mm}`;
  } catch {
    return `H${index + 1}`;
  }
};

const CustomizedAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const value = payload.value;
  if (value && value.includes(", ")) {
    const parts = value.split(", ");
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={4} textAnchor="middle" fill="var(--text-secondary)" className="text-[11px] sm:text-[12px] font-medium">
          <tspan x={0} dy={4}>{parts[1]}</tspan>
          <tspan x={0} dy={14} className="fill-[var(--text-muted)] text-[9px] sm:text-[10px]">{parts[0]}</tspan>
        </text>
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={14} textAnchor="middle" fill="var(--text-secondary)" className="text-[11px] sm:text-[12px] font-medium">
        {value}
      </text>
    </g>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.03) return null;
  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [chartMetric, setChartMetric] = useState<"amount" | "count">("amount");
  const [barMetric, setBarMetric] = useState<"percentage" | "count">("percentage");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, forecastRes, userRes, recentsRes] = await Promise.all([
          axiosInstance.get("/message/analytics"),
          axiosInstance.post("/forecast/forecast", {}),
          axiosInstance.get("/user/userData"),
          axiosInstance.get("/message/recents"),
        ]);
        setAnalytics(analyticsRes.data.data);
        setForecastData(forecastRes.data.data || forecastRes.data);
        setUser(userRes.data.data);
        setRecentTransactions(recentsRes.data?.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching analytics/forecast data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const usageArray =
    analytics &&
    Object.entries(analytics.usageBreakdown || {}).map(([name, value]) => ({ name, value }));

  const barChartData = analytics && analytics.usageBreakdown ? 
    Object.entries(analytics.usageBreakdown).map(([name, pct]) => {
      const matchedTop = analytics.topUsed.find(t => t.name === name);
      const matchedLeast = analytics.leastUsed.find(t => t.name === name);
      
      const totalTx = analytics.topUsed[0]
        ? Math.round((analytics.topUsed[0].transactions / analytics.topUsed[0].percentage) * 100)
        : 0;

      const transactions = matchedTop?.transactions 
        || matchedLeast?.transactions 
        || Math.round((pct / 100) * totalTx);

      return {
        name,
        percentage: pct,
        transactions
      };
    }).sort((a, b) => b.percentage - a.percentage)
    : [];

  const sentForecastPoints = forecastData?.sent?.forecast?.length || 1;
  const receivedForecastPoints = forecastData?.received?.forecast?.length || 1;

  const avgPredictedSentAmount =
    (forecastData?.sent?.forecast?.reduce((s, i) => s + i.pred_amount, 0) || 0) / sentForecastPoints;
  const avgPredictedReceivedAmount =
    (forecastData?.received?.forecast?.reduce((s, i) => s + i.pred_amount, 0) || 0) / receivedForecastPoints;
  const avgPredictedSentCount =
    (forecastData?.sent?.forecast?.reduce((s, i) => s + i.pred_count, 0) || 0) / sentForecastPoints;
  const avgPredictedReceivedCount =
    (forecastData?.received?.forecast?.reduce((s, i) => s + i.pred_count, 0) || 0) / receivedForecastPoints;

  const sentForecast = forecastData?.sent?.forecast ?? [];
  const receivedForecast = forecastData?.received?.forecast ?? [];
  const maxSteps = Math.max(sentForecast.length, receivedForecast.length);

  const lineChartData = Array.from({ length: maxSteps }, (_, i) => {
    const s = sentForecast[i];
    const r = receivedForecast[i];
    return {
      hour: buildForecastLabel(s?.Time || r?.Time || "", i),
      sentAmount: Math.round(s?.pred_amount || 0),
      receivedAmount: Math.round(r?.pred_amount || 0),
      sentCount: Math.round(s?.pred_count || 0),
      receivedCount: Math.round(r?.pred_count || 0),
    };
  });

  // ── PDF Export via jsPDF + html2canvas ────────────────────────────────────
  const handleDownloadPdf = async () => {
    setExportingPdf(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const now = new Date();

      // ── Helpers ────────────────────────────────────────────────────────
      const captureElement = async (id: string) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
        return canvas.toDataURL("image/png");
      };

      const addPageHeader = (pageNum: number, total: number) => {
        // emerald banner
        doc.setFillColor(16, 185, 129);
        doc.rect(0, 0, W, 18, "F");
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("CentralPay  —  Analytics Report", 10, 12);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Generated: ${now.toLocaleDateString("en-GB")} ${now.toLocaleTimeString("en-GB")}`,
          W - 10,
          12,
          { align: "right" }
        );
        // footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${pageNum} of ${total}`, W / 2, H - 6, { align: "center" });
      };

      const sectionTitle = (label: string, y: number) => {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text(label, 10, y);
        doc.setDrawColor(226, 232, 240);
        doc.line(10, y + 2, W - 10, y + 2);
        return y + 8;
      };

      // ── Capture charts BEFORE building pages (DOM is stable) ───────────
      const [forecastImg, pieImg, barImg] = await Promise.all([
        captureElement("forecast-chart-container"),
        captureElement("payment-usage-pie-container"),
        captureElement("payment-methods-bar-container"),
      ]);

      // ═══════════════════════════════════════════════════════════════════
      // PAGE 1  — Account info + Forecast KPIs + Pie chart
      // ═══════════════════════════════════════════════════════════════════
      let y = 28;

      // Account info card
      y = sectionTitle("Account Profile", y);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(10, y - 4, W - 20, 28, 3, 3, "FD");

      const infoRows: [string, string, string, string][] = [
        ["Client Name", user?.name ?? "—", "Status", "Active"],
        ["Email", user?.email ?? "—", "Service", "CentralPay Gateway"],
      ];
      infoRows.forEach(([l1, v1, l2, v2], ri) => {
        const ry = y + ri * 12;
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 116, 139);
        doc.text(l1, 14, ry + 2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(v1, 40, ry + 2);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 116, 139);
        doc.text(l2, W / 2 + 5, ry + 2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(v2, W / 2 + 25, ry + 2);
      });
      y += 34;

      // 48-Hour Forecast KPI cards (2×2 grid)
      y = sectionTitle("48-Hour Forecast Predictions", y);
      const kpis: [string, string][] = [
        ["Avg Sent Volume / Hour", `${formatNumber(Math.round(avgPredictedSentAmount))} EGP`],
        ["Avg Received Volume / Hour", `${formatNumber(Math.round(avgPredictedReceivedAmount))} EGP`],
        ["Avg Sent Transactions / Hour", formatNumber(Math.round(avgPredictedSentCount))],
        ["Avg Received Transactions / Hour", formatNumber(Math.round(avgPredictedReceivedCount))],
      ];
      const cardW = (W - 24) / 2;
      kpis.forEach(([label, val], idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = 10 + col * (cardW + 4);
        const cy = y + row * 20;
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(16, 185, 129);
        doc.roundedRect(cx, cy - 5, cardW, 16, 2, 2, "FD");
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(label, cx + 3, cy);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129);
        doc.text(val, cx + 3, cy + 7);
      });
      y += 46;

      // Pie chart
      if (pieImg) {
        y = sectionTitle("Payment Usage Breakdown", y);
        const pieW = W - 20;
        const pieH = 95;
        doc.addImage(pieImg, "PNG", 10, y, pieW, pieH);
        y += pieH + 8;
      }

      // ═══════════════════════════════════════════════════════════════════
      // PAGE 2  — Payment methods + Forecast chart
      // ═══════════════════════════════════════════════════════════════════
      doc.addPage();
      y = 28;

      // Top used
      y = sectionTitle("Top Used Payment Methods", y);
      (analytics?.topUsed ?? []).forEach((item) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text(item.name, 10, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(`${item.transactions} txns`, 70, y);
        y += 3;
        const bW = W - 20;
        doc.setFillColor(226, 232, 240);
        doc.roundedRect(10, y, bW, 3, 1.5, 1.5, "F");
        doc.setFillColor(16, 185, 129);
        doc.roundedRect(10, y, Math.max(2, (bW * item.percentage) / 100), 3, 1.5, 1.5, "F");
        y += 9;
      });

      y += 4;

      // Least used
      y = sectionTitle("Least Used Payment Methods", y);
      (analytics?.leastUsed ?? []).forEach((item) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text(item.name, 10, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(`${item.transactions} txns`, 70, y);
        y += 3;
        const bW = W - 20;
        doc.setFillColor(226, 232, 240);
        doc.roundedRect(10, y, bW, 3, 1.5, 1.5, "F");
        doc.setFillColor(244, 63, 94);
        doc.roundedRect(10, y, Math.max(2, (bW * item.percentage) / 100), 3, 1.5, 1.5, "F");
        y += 9;
      });

      y += 6;

      // Bar Chart
      if (barImg) {
        y = sectionTitle("Payment Methods Performance", y);
        const barW = W - 20;
        const barH = 90;
        if (y + barH > H - 20) { doc.addPage(); y = 28; }
        doc.addImage(barImg, "PNG", 10, y, barW, barH);
        y += barH + 8;
      }

      // Forecast line chart
      if (forecastImg) {
        y = sectionTitle("48-Hour Forecast Trend", y);
        const fcW = W - 20;
        const fcH = 90;
        if (y + fcH > H - 20) { doc.addPage(); y = 28; }
        doc.addImage(forecastImg, "PNG", 10, y, fcW, fcH);
        y += fcH + 8;
      }

      // ─── Recent Transactions ───────────────────────────────────────────
      const recentSlice = recentTransactions.slice(0, 10);
      if (recentSlice.length > 0) {
        if (y + 60 > H - 20) { doc.addPage(); y = 28; }

        y = sectionTitle("Recent Transactions", y);

        // Table header row
        doc.setFillColor(241, 245, 249);
        doc.rect(10, y - 4, W - 20, 8, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Date", 13, y + 1);
        doc.text("Sender", 55, y + 1);
        doc.text("Device", 110, y + 1);
        doc.text("Type", 155, y + 1);
        doc.text("Amount", W - 13, y + 1, { align: "right" });
        y += 9;

        recentSlice.forEach((tx) => {
          if (y > H - 18) { doc.addPage(); y = 28; }

          const dateStr = (() => {
            try {
              const d = new Date(tx.date);
              return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}  ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
            } catch { return tx.date ?? "—"; }
          })();

          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(30, 41, 59);
          doc.text(dateStr, 13, y);
          doc.text((tx.sender ?? "—").slice(0, 20), 55, y);
          doc.text((tx.device ?? "—").slice(0, 20), 110, y);

          if (tx.type === "received") {
            doc.setTextColor(16, 185, 129);
            doc.text("Received", 155, y);
          } else {
            doc.setTextColor(244, 63, 94);
            doc.text("Sent", 155, y);
          }

          doc.setTextColor(30, 41, 59);
          doc.text(`${formatNumber(tx.amount)} EGP`, W - 13, y, { align: "right" });

          // thin separator
          doc.setDrawColor(241, 245, 249);
          doc.line(10, y + 2, W - 10, y + 2);
          y += 9;
        });
      }

      // Add headers/footers to all pages (now we know total)
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        addPageHeader(p, totalPages);
      }

      doc.save(`CentralPay_Report_${now.toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setExportingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 min-h-screen" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <div className="skeleton-shimmer h-8 w-60 rounded-lg mb-3" />
            <div className="skeleton-shimmer h-4 w-96 rounded-lg" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="skeleton-shimmer h-5 w-32 rounded-lg mb-5" />
                <div className="skeleton-shimmer h-8 w-44 rounded-lg mb-3" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="skeleton-shimmer h-6 w-48 rounded-lg mb-6" />
            <div className="skeleton-shimmer h-[300px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 sm:p-6 lg:p-10 min-h-screen"
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                boxShadow: "0 8px 24px rgba(16,185,129,.3)",
              }}
            >
              <BarChart3 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Analytics Overview</h1>
              <p className="text-[var(--text-secondary)] mt-1 text-sm">
                Track payment performance, usage breakdown, and upcoming forecast
              </p>
            </div>
          </div>

          <button
            id="export-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={exportingPdf}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            style={{
              background: exportingPdf ? "#94a3b8" : "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: exportingPdf ? "none" : "0 4px 14px rgba(16,185,129,.4)",
            }}
          >
            {exportingPdf ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Generating PDF…
              </>
            ) : (
              <>
                <FileText size={17} />
                Export PDF
                <Download size={15} className="opacity-75" />
              </>
            )}
          </button>
        </motion.div>

        {/* Forecast KPI Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          <motion.div variants={fadeInUp} className="stat-card stat-card-indigo card-hover">
            <div className="icon-badge icon-badge-indigo mb-4"><TrendingUp size={20} /></div>
            <p className="text-[var(--text-secondary)] text-sm">Avg Sent Volume / Hour</p>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {formatNumber(Math.round(avgPredictedSentAmount))}
              <span className="text-sm font-medium text-[var(--text-muted)] ml-1">EGP</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="stat-card stat-card-green card-hover">
            <div className="icon-badge icon-badge-emerald mb-4"><TrendingDown size={20} /></div>
            <p className="text-[var(--text-secondary)] text-sm">Avg Received Volume / Hour</p>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {formatNumber(Math.round(avgPredictedReceivedAmount))}
              <span className="text-sm font-medium text-[var(--text-muted)] ml-1">EGP</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="stat-card stat-card-violet card-hover">
            <div className="icon-badge icon-badge-violet mb-4"><Activity size={20} /></div>
            <p className="text-[var(--text-secondary)] text-sm">Avg Sent Transactions / Hour</p>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {formatNumber(Math.round(avgPredictedSentCount))}
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="stat-card stat-card-rose card-hover">
            <div className="icon-badge icon-badge-cyan mb-4"><Activity size={20} /></div>
            <p className="text-[var(--text-secondary)] text-sm">Avg Received Transactions / Hour</p>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {formatNumber(Math.round(avgPredictedReceivedCount))}
            </h2>
          </motion.div>
        </motion.div>

        {/* 48 Hour Forecast Line Chart */}
        <motion.div
          variants={fadeInUp}
          className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-sm border border-[var(--border-card)]"
        >
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">48 Hour Forecast</h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                Dynamic transaction predictions comparing Sent vs Received paths
              </p>
            </div>
            <div className="flex bg-[var(--bg-table-hover)] p-1 rounded-xl">
              <button
                id="metric-amount-btn"
                onClick={() => setChartMetric("amount")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  chartMetric === "amount"
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Volume (EGP)
              </button>
              <button
                id="metric-count-btn"
                onClick={() => setChartMetric("count")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  chartMetric === "count"
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Tx Count
              </button>
            </div>
          </div>

          <div id="forecast-chart-container" style={{ background: "#fff", padding: "8px", borderRadius: "12px" }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-card)" />
                <XAxis
                  dataKey="hour"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  height={45}
                  interval={isMobile ? 7 : 3}
                  tick={<CustomizedAxisTick />}
                />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false}
                  tickFormatter={(v) =>
                    chartMetric === "amount"
                      ? v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v
                      : v
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderRadius: "16px",
                    border: "1px solid var(--border-card)",
                    boxShadow: "0 10px 30px rgba(0,0,0,.1)",
                    fontSize: "13px",
                    color: "var(--text-primary)",
                  }}
                  itemStyle={{ color: "var(--text-primary)" }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  formatter={(value: any, name: any) => [
                    chartMetric === "amount" ? `${formatNumber(Number(value || 0))} EGP` : formatNumber(Number(value || 0)),
                    name,
                  ]}
                />
                <Legend verticalAlign="top" height={36} />
                <Line name={chartMetric === "amount" ? "Sent Volume (EGP)" : "Sent Transactions"}
                  type="monotone" dataKey={chartMetric === "amount" ? "sentAmount" : "sentCount"}
                  stroke="#f59e0b" strokeWidth={3} dot={false} isAnimationActive={false}
                  activeDot={{ r: 7, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }} />
                <Line name={chartMetric === "amount" ? "Received Volume (EGP)" : "Received Transactions"}
                  type="monotone" dataKey={chartMetric === "amount" ? "receivedAmount" : "receivedCount"}
                  stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false}
                  activeDot={{ r: 7, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payment Methods Performance Bar Chart */}
        <motion.div
          variants={fadeInUp}
          className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-sm border border-[var(--border-card)]"
        >
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Payment Methods Performance</h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                Comparing total volume percentage and transaction count across payment channels
              </p>
            </div>
            <div className="flex bg-[var(--bg-table-hover)] p-1 rounded-xl">
              <button
                id="bar-metric-pct-btn"
                onClick={() => setBarMetric("percentage")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  barMetric === "percentage"
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Usage (%)
              </button>
              <button
                id="bar-metric-count-btn"
                onClick={() => setBarMetric("count")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  barMetric === "count"
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Tx Count
              </button>
            </div>
          </div>

          <div id="payment-methods-bar-container" style={{ background: "#fff", padding: "16px 8px 8px 8px", borderRadius: "12px" }}>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barChartData} barSize={isMobile ? 25 : 45}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-card)" />
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    className="font-medium"
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      barMetric === "percentage" ? `${v}%` : v
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                    contentStyle={{
                      backgroundColor: "var(--bg-card)",
                      borderRadius: "16px",
                      border: "1px solid var(--border-card)",
                      boxShadow: "0 10px 30px rgba(0,0,0,.1)",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                    }}
                    itemStyle={{ color: "var(--text-primary)" }}
                    labelStyle={{ color: "var(--text-primary)" }}
                    formatter={(value: any, name: any) => [
                      barMetric === "percentage" ? `${Number(value || 0).toFixed(2)}%` : formatNumber(Number(value || 0)),
                      name,
                    ]}
                  />
                  <Bar
                    name={barMetric === "percentage" ? "Usage Percentage" : "Transaction Count"}
                    dataKey={barMetric === "percentage" ? "percentage" : "transactions"}
                    fill={barMetric === "percentage" ? "url(#colorAmount)" : "url(#colorCount)"}
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-slate-400">
                No performance data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Usage breakdown & Lists */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            id="payment-usage-pie-container"
            variants={fadeInUp}
            className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-sm border border-[var(--border-card)]"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Payment Usage Breakdown</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              Distribution of payment methods based on transaction usage
            </p>

            {usageArray && usageArray.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-[var(--text-primary)] text-xs font-semibold px-1">{value}</span>
                    )}
                  />
                  <Pie data={usageArray} dataKey="value" nameKey="name" outerRadius={100}
                    labelLine={false} label={renderCustomizedLabel}>
                    {usageArray.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-card)",
                      borderRadius: "12px",
                      border: "1px solid var(--border-card)",
                      boxShadow: "0 4px 16px rgba(0,0,0,.08)",
                      color: "var(--text-primary)",
                    }}
                    itemStyle={{ color: "var(--text-primary)" }}
                    labelStyle={{ color: "var(--text-primary)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No usage data available
              </div>
            )}
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={fadeInUp} className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-sm border border-[var(--border-card)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-badge icon-badge-emerald"><ArrowUpRight size={18} /></div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Top Used Payment Methods</h2>
              </div>
              {analytics?.topUsed?.length ? (
                analytics.topUsed.map((item) => (
                  <div key={item.name} className="mb-5">
                    <div className="flex justify-between text-sm text-[var(--text-secondary)] mb-2">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-[var(--text-muted)]">{item.transactions} txns</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-table-hover)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="h-2 rounded-full"
                        style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[var(--text-muted)]">No top methods available</p>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-sm border border-[var(--border-card)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-badge icon-badge-rose"><ArrowDownRight size={18} /></div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Least Used Payment Methods</h2>
              </div>
              {analytics?.leastUsed?.length ? (
                analytics.leastUsed.map((item) => (
                  <div key={item.name} className="mb-5">
                    <div className="flex justify-between text-sm text-[var(--text-secondary)] mb-2">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-[var(--text-muted)]">{item.transactions} txns</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-table-hover)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        className="h-2 rounded-full"
                        style={{ background: "linear-gradient(90deg, #f43f5e, #fb923c)" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[var(--text-muted)]">No least methods available</p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
