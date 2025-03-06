"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function GradientTitle({ title }: { title: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">{title}</h1>
  }

  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-lime-500 via-emerald-500 to-lime-500 bg-size-200 animate-gradient-x"
    >
      {title}
    </motion.h1>
  )
}
