import { motion } from "framer-motion"

// Gradient Title Component
// Updated GradientTitle with centered text
export function GradientTitle({ title }: { title: string }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-600 bg-size-200 animate-gradient-x text-center"
    >
      {title}
    </motion.h1>
  )
}
