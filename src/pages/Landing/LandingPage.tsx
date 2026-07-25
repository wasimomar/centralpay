import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  BarChart3,
  Globe2,
  ArrowRight,
  Wallet,
  Users,
  CheckCircle2,
  Coins,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─── read current theme ─── */
function useTheme() {
  const [isDark, setIsDark] = useState(
    !document.documentElement.classList.contains("light")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(!document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

/* ─── animated counter hook ─── */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const steps = 60;
    const inc = target / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(cur));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

/* ─── feature cards data ─── */
const features = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Bank-Grade Security",
    desc: "End-to-end encryption with two-factor authentication keeps your financial tracking data safe and private.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    icon: <Zap size={28} />,
    title: "Instant Sync",
    desc: "Sync your balance and transaction logs across all devices instantly without any delays.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Smart Analytics",
    desc: "Visualize your spending patterns with real-time charts and intelligent financial insights.",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
  },
  {
    icon: <Globe2 size={28} />,
    title: "Multi-Wallet Support",
    desc: "Track and monitor all your digital wallets — Vodafone Cash, Orange Cash, and more — in one dashboard.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    icon: <Users size={28} />,
    title: "Split Expenses",
    desc: "Split bills across team members or wallets — always know who paid what, no matter which wallet.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
];

/* ─── stat items ─── */
const statsData = [
  { label: "Active Users", value: 12000, suffix: "+", prefix: "" },
  { label: "Transactions Tracked", value: 500, suffix: "K+", prefix: "" },
  { label: "Uptime", value: 99, suffix: ".9%", prefix: "" },
  { label: "Supported Wallets", value: 8, suffix: "+", prefix: "" },
];

/* ─── floating orbs background — theme aware ─── */
function FloatingOrbs({ isDark }: { isDark: boolean }) {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ transition: "background 0.4s ease" }}
    >
      {/* base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark ? "#090d16" : "#f0fdf7",
          transition: "background 0.4s ease",
        }}
      />

      {/* emerald orb */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* amber orb */}
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* cyan orb */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          top: "40%",
          left: "45%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)",
          filter: "blur(35px)",
        }}
      />

      {/* grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: isDark
            ? "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)"
            : "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

/* ─── particle dots ─── */
function ParticleDots({ isDark }: { isDark: boolean }) {
  const dots = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 4,
    }))
  ).current;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          animate={{ opacity: [0.1, isDark ? 0.6 : 0.4, 0.1], y: [0, -20, 0] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay }}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: "#10b981",
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const isDark = useTheme();

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const c0 = useCounter(statsData[0].value, 2000, statsVisible);
  const c1 = useCounter(statsData[1].value, 2000, statsVisible);
  const c2 = useCounter(statsData[2].value, 2000, statsVisible);
  const c3 = useCounter(statsData[3].value, 2000, statsVisible);
  const counters = [c0, c1, c2, c3];

  /* theme-aware palette */
  const t = {
    text:        isDark ? "#f3f4f6"  : "#0f172a",
    textSub:     isDark ? "#9ca3af"  : "#64748b",
    textMuted:   isDark ? "#6b7280"  : "#94a3b8",
    cardBg:      isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.75)",
    cardBorder:  isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    walletBg:    isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.6)",
    walletBorder:isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.1)",
    signInBg:    isDark ? "transparent"             : "rgba(255,255,255,0.7)",
    signInBorder:isDark ? "rgba(255,255,255,0.2)"  : "rgba(0,0,0,0.15)",
    signInText:  isDark ? "#f3f4f6"  : "#0f172a",
    footerBorder:isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
    footerText:  isDark ? "#4b5563"  : "#64748b",
    scrollArrow: isDark ? "#374151"  : "#94a3b8",
    benefitText: isDark ? "#d1d5db"  : "#334155",
    stepTitle:   isDark ? "#f3f4f6"  : "#0f172a",
    featureTitle:isDark ? "#f3f4f6"  : "#0f172a",
    featureDesc: isDark ? "#6b7280"  : "#64748b",
    sectionDesc: isDark ? "#9ca3af"  : "#64748b",
    statsLabel:  isDark ? "#6b7280"  : "#64748b",
    ctaSecBg:    isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    ctaSecBorder:isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
    ctaSecText:  isDark ? "#f3f4f6"  : "#0f172a",
    benefitBg:   isDark
      ? "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(245,158,11,0.05))"
      : "linear-gradient(135deg, rgba(16,185,129,0.07), rgba(245,158,11,0.04))",
    benefitBorder: isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.25)",
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show:   { opacity: 1, y: 0 },
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        color: t.text,
        overflowX: "hidden",
        transition: "color 0.3s ease",
      }}
    >
      <FloatingOrbs isDark={isDark} />
      <ParticleDots isDark={isDark} />

      {/* ══ HERO ══ */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "clamp(88px, 12vw, 120px) clamp(16px, 5vw, 48px) 60px",
          position: "relative",
        }}
      >
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 999,
            border: "1px solid rgba(16,185,129,0.4)",
            background: "rgba(16,185,129,0.08)",
            marginBottom: 28,
            fontSize: "clamp(11px, 2vw, 13px)",
            fontWeight: 600,
            letterSpacing: "0.05em",
            color: "#34d399",
          }}
        >
          <Coins size={14} />
          Egypt's Unified Wallet Tracker
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: "clamp(2rem, 7vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 820,
            margin: "0 auto 24px",
            color: t.text,
          }}
        >
          Know where your{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #10b981, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            money goes
          </span>
        </motion.h1>

        {/* sub */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
            color: t.textSub,
            maxWidth: 600,
            lineHeight: 1.7,
            marginBottom: 44,
            padding: "0 8px",
          }}
        >
          Built for businesses juggling multiple digital wallets — Fawry,
          Vodafone Cash, Orange Cash, and more. Track every transaction securely
          across all your wallets in one beautifully unified dashboard. Your
          data is fully encrypted and 100% safe.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "0 16px",
          }}
        >
          <motion.button
            id="landing-get-started"
            whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(16,185,129,0.45)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "clamp(12px,2vw,14px) clamp(22px,4vw,32px)",
              borderRadius: 14,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "clamp(14px, 2vw, 16px)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            Start Tracking Free
            <ArrowRight size={18} />
          </motion.button>

          <motion.button
            id="landing-signin"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "clamp(12px,2vw,14px) clamp(22px,4vw,32px)",
              borderRadius: 14,
              background: t.signInBg,
              color: t.signInText,
              fontWeight: 600,
              fontSize: "clamp(14px, 2vw, 16px)",
              border: `1px solid ${t.signInBorder}`,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              whiteSpace: "nowrap",
              transition: "all 0.3s ease",
            }}
          >
            Sign In
          </motion.button>
        </motion.div>

        {/* trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 44,
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "0 16px",
          }}
        >
          {["Fawry", "Vodafone Cash", "Orange Cash", "Etisalat Cash"].map((w) => (
            <div
              key={w}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: `1px solid ${t.walletBorder}`,
                background: t.walletBg,
                fontSize: "clamp(10px, 1.5vw, 12px)",
                fontWeight: 600,
                color: t.textMuted,
                letterSpacing: "0.03em",
                backdropFilter: "blur(4px)",
                transition: "all 0.3s ease",
              }}
            >
              {w}
            </div>
          ))}
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginTop: 60, color: t.scrollArrow }}
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* ══ STATS ══ */}
      <section
        ref={statsRef}
        style={{ padding: "60px clamp(16px,5vw,48px)", maxWidth: 1100, margin: "0 auto" }}
      >
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {statsData.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              style={{
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                borderRadius: 20,
                padding: "28px 20px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #10b981, #f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {s.prefix}{counters[i]}{s.suffix}
              </div>
              <div style={{ fontSize: 13, color: t.statsLabel, fontWeight: 500 }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══ FEATURES ══ */}
      <section style={{ padding: "80px clamp(16px,5vw,48px)", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 999,
              border: "1px solid rgba(245,158,11,0.3)",
              background: "rgba(245,158,11,0.07)",
              fontSize: 12,
              fontWeight: 600,
              color: "#f59e0b",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Everything You Need
          </div>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 800,
              marginBottom: 14,
              letterSpacing: "-0.02em",
              color: t.text,
            }}
          >
            All your wallets,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #10b981, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              one view
            </span>
          </h2>
          <p style={{ color: t.sectionDesc, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Whether it's GI, Orange Cash, Vodafone Cash, or any other digital
            wallet — see your balances, every transaction, and every pattern in
            a single unified dashboard.
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: 18,
          }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: `0 16px 40px ${f.color}22` }}
              style={{
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                borderRadius: 20,
                padding: "28px 24px",
                cursor: "default",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* top glow line */}
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  width: 54, height: 54,
                  borderRadius: 16,
                  background: f.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: f.color,
                  marginBottom: 18,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: t.featureTitle }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: t.featureDesc, lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ padding: "80px clamp(16px,5vw,48px)", maxWidth: 900, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 12,
              color: t.text,
            }}
          >
            Get started in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f59e0b, #10b981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              3 simple steps
            </span>
          </h2>
          <p style={{ color: t.sectionDesc, lineHeight: 1.6 }}>
            Set up your account in minutes, no technical knowledge required.
          </p>
        </motion.div>

        <div style={{ position: "relative" }}>
          {/* connector line — hidden on small screens */}
          <div
            className="hidden sm:block"
            style={{
              position: "absolute",
              top: 28,
              left: "calc(50% - 1px)",
              width: 2,
              height: "calc(100% - 56px)",
              background: "linear-gradient(to bottom, rgba(16,185,129,0.4), rgba(16,185,129,0.05))",
            }}
          />

          {[
            {
              step: "01",
              title: "Create your account",
              desc: "Sign up for free in under a minute. No credit card required.",
              icon: <Users size={20} />,
            },
            {
              step: "02",
              title: "Connect your wallets",
              desc: "Link your digital wallets — Vodafone Cash, Fawry, Orange Cash — with one click.",
              icon: <Wallet size={20} />,
            },
            {
              step: "03",
              title: "Track & analyze",
              desc: "Get instant insights and monitor all transaction activities in real time.",
              icon: <BarChart3 size={20} />,
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginBottom: 48,
                /* on mobile: always row, centered */
                flexDirection: "row",
                textAlign: "left",
              }}
            >
              {/* text left side (alternates on sm+) */}
              <div
                style={{
                  flex: 1,
                  order: 0,
                  textAlign: "left",
                }}
                className={i % 2 !== 0 ? "sm:order-2 sm:text-right" : ""}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#10b981",
                    letterSpacing: "0.08em",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  Step {item.step}
                </div>
                <h3 style={{ fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 700, marginBottom: 8, color: t.stepTitle }}>
                  {item.title}
                </h3>
                <p style={{ color: t.featureDesc, fontSize: 14, lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </div>

              {/* center icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  flexShrink: 0,
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 0 24px rgba(16,185,129,0.35)",
                  zIndex: 1,
                }}
              >
                {item.icon}
              </motion.div>

              {/* right spacer (hidden on mobile) */}
              <div style={{ flex: 1 }} className={i % 2 !== 0 ? "hidden sm:block sm:order-0" : "hidden sm:block"} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ BENEFITS STRIP ══ */}
      <section style={{ padding: "40px clamp(16px,5vw,48px)", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: t.benefitBg,
            border: `1px solid ${t.benefitBorder}`,
            borderRadius: 24,
            padding: "clamp(24px, 4vw, 40px) clamp(20px, 4vw, 32px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: 20,
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
          }}
        >
          {[
            "100% Secure & Encrypted",
            "Real-time balance updates",
            "Export reports as CSV/PDF",
            "Multi-device sync & support",
          ].map((benefit) => (
            <div
              key={benefit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: "clamp(13px,2vw,14px)",
                fontWeight: 500,
                color: t.benefitText,
                transition: "color 0.3s ease",
              }}
            >
              <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
              {benefit}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section
        style={{
          padding: "100px clamp(16px,5vw,48px)",
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* glow blob */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              width: 500,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(16,185,129,0.15) 0%, transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />

          <h2
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 16,
              lineHeight: 1.15,
              color: t.text,
            }}
          >
            Ready to take control of{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #10b981, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              your finances?
            </span>
          </h2>
          <p
            style={{
              color: t.sectionDesc,
              fontSize: "clamp(14px,2vw,16px)",
              lineHeight: 1.7,
              maxWidth: 500,
              margin: "0 auto 44px",
            }}
          >
            Join thousands of businesses and individuals already using
            CentralPay to track their digital wallets smarter.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button
              id="landing-cta-register"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(16,185,129,0.5)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "clamp(13px,2vw,16px) clamp(24px,4vw,36px)",
                borderRadius: 16,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "clamp(14px,2vw,17px)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 24px rgba(16,185,129,0.35)",
                whiteSpace: "nowrap",
              }}
            >
              Create Free Account
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              id="landing-cta-login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
              style={{
                padding: "clamp(13px,2vw,16px) clamp(24px,4vw,36px)",
                borderRadius: 16,
                background: t.ctaSecBg,
                color: t.ctaSecText,
                fontWeight: 600,
                fontSize: "clamp(14px,2vw,17px)",
                border: `1px solid ${t.ctaSecBorder}`,
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                whiteSpace: "nowrap",
                transition: "all 0.3s ease",
              }}
            >
              I already have an account
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        style={{
          borderTop: `1px solid ${t.footerBorder}`,
          padding: "32px clamp(16px,5vw,48px)",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 28, height: 28,
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/centralPay_Logo.jpeg"
              alt="CentralPay"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: t.text }}>
            Central
            <span
              style={{
                background: "linear-gradient(135deg, #10b981, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pay
            </span>
          </span>
        </div>
        <p style={{ color: t.footerText, fontSize: 13 }}>
          © {new Date().getFullYear()} CentralPay. All rights reserved. Built
          for the future of Egyptian digital finance.
        </p>
      </footer>
    </div>
  );
}
