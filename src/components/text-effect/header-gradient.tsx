"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function GradientTitle({ title }: { title: string }) {

  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-500 to-gray-600"
    >
      {title}
    </motion.h1>
  )
}
