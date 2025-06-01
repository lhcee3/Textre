"use client"

import { motion } from "framer-motion"

export function AnimatedLogo() {
  return (
    <motion.h1
      className="text-2xl font-bold relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-gradient">
        Textre
      </span>
    </motion.h1>
  )
}
