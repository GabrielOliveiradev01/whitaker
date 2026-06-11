import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Wordmark from '../components/Wordmark'
import { waLink } from '../lib/contact'

function GooglePlayIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <path fill="#34A853" d="M48 54 259 256 48 458Z" />
      <path fill="#EA4335" d="M48 54 259 256 392 180Z" />
      <path fill="#4285F4" d="M48 458 259 256 392 332Z" />
      <path fill="#FBBC04" d="M259 256 392 180 470 256 392 332Z" />
    </svg>
  )
}

function StoreButton({ href = '#', store = 'android' }) {
  const isAndroid = store === 'android'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-gold/45 bg-white/[0.02] px-6 py-3.5 transition-all duration-500 hover:border-gold hover:bg-gold/[0.06] hover:-translate-y-0.5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/20 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
      />
      {isAndroid ? (
        <GooglePlayIcon className="relative h-7 w-7" />
      ) : (
        <svg viewBox="0 0 24 24" className="relative h-7 w-7 fill-silver" aria-hidden="true">
          <path d="M16.4 12.8c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1 2.6-2 .8-1.2 1.2-2.3 1.2-2.4-.1 0-2.3-.9-2.3-3.5zM14.2 6.1c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z" />
        </svg>
      )}
      <span className="relative flex flex-col leading-tight">
        <span className="text-[9px] uppercase tracking-[0.2em] text-silver-dim">
          Disponível para
        </span>
        <span className="text-base font-semibold uppercase tracking-wide text-silver">
          {isAndroid ? 'Android' : 'iOS'}
        </span>
      </span>
    </a>
  )
}

function GlowingPhone() {
  return (
    <div className="relative mx-auto w-[280px] max-w-full">
      {/* pool of warm light at the base */}
      <div className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-[150%] -translate-x-1/2 rounded-[100%] bg-gold/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-6 left-1/2 h-16 w-[80%] -translate-x-1/2 rounded-[100%] bg-gold-bright/40 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 40, rotateY: -12 }}
        whileInView={{ opacity: 1, y: 0, rotateY: -8 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
        className="relative aspect-[9/19] rounded-[2.8rem] bg-gradient-to-b from-graphite-light via-ink-700 to-ink-900 p-[3px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
      >
        {/* gold rim light on the right edge */}
        <span className="pointer-events-none absolute inset-y-6 right-0 w-px rounded-full bg-gradient-to-b from-transparent via-gold-bright/70 to-transparent" />

        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.6rem] bg-ink-900">
          {/* camera */}
          <span className="absolute left-1/2 top-4 h-2 w-2 -translate-x-1/2 rounded-full bg-ink-600 ring-1 ring-white/10" />

          {/* screen glow behind logo */}
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl" />

          <Wordmark glow className="text-[2.1rem]" />
        </div>
      </motion.div>
    </div>
  )
}

export default function Download() {
  return (
    <section id="app" className="relative overflow-hidden px-6 py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* left: copy */}
        <div className="text-center lg:text-left">
          <Reveal>
            <Wordmark className="text-[1.9rem]" />
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-10 text-6xl font-bold uppercase leading-[0.95] tracking-tight text-silver sm:text-7xl">
              Baixe
              <br />
              o App
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-7 max-w-md text-lg leading-relaxed text-silver-dim lg:mx-0">
              Inteligência que encontra oportunidades.{' '}
              <span className="text-gold-bright">24h por você.</span>
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <StoreButton
                store="android"
                href={waLink('Olá! Quero baixar o aplicativo Whitaker para Android.')}
              />
            </div>
          </Reveal>
        </div>

        {/* right: glowing phone */}
        <Reveal direction="left">
          <div className="animate-floaty">
            <GlowingPhone />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
