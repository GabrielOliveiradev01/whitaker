import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// 3D tilt card that follows the mouse, with a moving gold spotlight,
// premium depth shadow and a sharp gold border on hover.
export default function TiltCard({ children, className = '', max = 10 }) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const sx = useSpring(mx, { stiffness: 140, damping: 18 })
  const sy = useSpring(my, { stiffness: 140, damping: 18 })

  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const rotateY = useTransform(sx, [0, 1], [-max, max])

  const glowX = useTransform(sx, [0, 1], ['0%', '100%'])
  const glowY = useTransform(sy, [0, 1], ['0%', '100%'])

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }
  const reset = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`group relative ${className}`}
    >
      {/* moving gold spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) =>
              `radial-gradient(420px circle at ${x} ${y}, rgba(200,169,106,0.18), transparent 55%)`
          ),
        }}
      />
      <div
        style={{ transform: 'translateZ(40px)' }}
        className="relative h-full"
      >
        {children}
      </div>
    </motion.div>
  )
}
