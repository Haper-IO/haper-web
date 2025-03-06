import { useRef, useEffect, ReactNode } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const FadeInWhenVisible = ({ children, delay = 0, className }: FadeInWhenVisibleProps) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
