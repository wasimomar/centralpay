import { motion } from "framer-motion";
import { useMemo } from "react";

const FloatingShapes = () => {
  const shapes = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        size: 8 + Math.random() * 10,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: i % 2 === 0 ? "#2563eb" : "#16a34a",
        duration: 6 + Math.random() * 6,
      })),
    []
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full opacity-20"
          style={{
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.color,
            top: `${shape.top}%`,
            left: `${shape.left}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
