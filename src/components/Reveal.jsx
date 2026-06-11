import { motion } from 'framer-motion'

const variants = {
  hidden: (d) => ({
    opacity: 0,
    y: d === 'up' ? 32 : d === 'down' ? -32 : 0,
    x: d === 'left' ? 32 : d === 'right' ? -32 : 0,
    filter: 'blur(8px)',
  }),
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    filter: 'blur(0px)',
  },
}

// Elegant scroll-reveal wrapper.
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  className = '',
  once = true,
  as = 'div',
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      custom={direction}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.25 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  )
}
