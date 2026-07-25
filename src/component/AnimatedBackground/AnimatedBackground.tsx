import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: "var(--bg-surface)" }}
      />
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "linear-gradient(120deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end))",
          backgroundSize: "200% 200%",
        }}
      />
    </>
  );
}
