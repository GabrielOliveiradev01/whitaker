import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// Smoothly counts from 0 to `value` when scrolled into view.
export default function CountUp({
  value = 0,
  duration = 2200,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const ease = (t) => 1 - Math.pow(1 - t, 4) // easeOutQuart

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setDisplay(value * ease(p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  const formatted = display.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
