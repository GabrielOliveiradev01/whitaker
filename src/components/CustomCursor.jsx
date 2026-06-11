import { useEffect, useRef, useState } from 'react'

// A premium two-layer cursor: a precise gold dot + a lagging glass ring.
// The ring grows and turns gold when hovering interactive elements.
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Only enable on devices with a fine pointer (real mouse).
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine)
    if (!fine) return

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: pos.x, y: pos.y }
    let raf

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
      }
      setHidden(false)
    }

    const onOver = (e) => {
      const interactive = e.target.closest(
        'a, button, [data-cursor="hover"], input, textarea'
      )
      setHovering(Boolean(interactive))
    }

    const onLeave = () => setHidden(true)

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16
      ring.y += (pos.y - ring.y) * 0.16
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ opacity: hidden ? 0 : 1, transition: 'opacity .3s' }}
    >
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold-bright"
        style={{ boxShadow: '0 0 10px rgba(230,199,137,0.9)' }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full border transition-[width,height,border-color,background-color] duration-300 ease-out"
        style={{
          width: hovering ? 56 : 34,
          height: hovering ? 56 : 34,
          borderColor: hovering
            ? 'rgba(200,169,106,0.9)'
            : 'rgba(207,210,214,0.35)',
          backgroundColor: hovering
            ? 'rgba(200,169,106,0.08)'
            : 'transparent',
          backdropFilter: hovering ? 'blur(2px)' : 'none',
        }}
      />
    </div>
  )
}
