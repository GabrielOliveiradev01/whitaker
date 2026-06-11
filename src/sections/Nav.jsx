import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Exclusividade', href: '#exclusividade' },
  { label: 'Inteligência', href: '#ia' },
  { label: 'App', href: '#app' },
  { label: 'Acesso', href: '#acesso' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${
          scrolled
            ? 'glass mx-4 rounded-full py-2.5 md:mx-auto'
            : 'bg-transparent'
        }`}
      >
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-gradient text-ink-900">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4 7 20 12 10 17 20 21 4" />
            </svg>
          </span>
          <span className="font-display text-xl tracking-widest2 text-silver">
            WHITAKER
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-[13px] uppercase tracking-[0.18em] text-silver-dim transition-colors hover:text-silver"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="#acesso"
          className="hidden rounded-full border border-gold/40 px-5 py-2 text-[13px] uppercase tracking-[0.16em] text-gold-bright transition-all hover:bg-gold/10 sm:inline-block"
        >
          Solicitar Convite
        </a>
      </div>
    </motion.header>
  )
}
