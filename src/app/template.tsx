"use client";

import { motion } from "framer-motion";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
}
