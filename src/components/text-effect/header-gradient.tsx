import { motion } from "framer-motion";

export function GradientTitle({ title }: { title: string }) {
  const words = title.split(" ");

  return (
    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-4 last:mr-0">
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: wordIndex * 0.1 + letterIndex * 0.03,
                type: "spring",
                stiffness: 150,
                damping: 25,
              }}
              className="inline-block text-transparent bg-clip-text
                          bg-gradient-to-r from-neutral-900 to-neutral-700/80
                          dark:from-white dark:to-white/80"
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}
