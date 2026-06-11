import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ShimmerButton from '../components/ShimmerButton'
import CountUp from '../components/CountUp'

const Globe = lazy(() => import('../components/Globe'))

const TERMINAL_LINES = [
  { t: '> conectando ao dispositivo via MCP...', c: 'text-silver-dim' },
  { t: '✓ 1.482 operações monitoradas em tempo real', c: 'text-gold-bright' },
  { t: '⚠ cobrança recorrente de R$ 289,90 em 48h', c: 'text-gold' },
  { t: '➜ aviso prévio enviado · 2 dias de antecedência', c: 'text-silver' },
  { t: '⚠ transação fora do padrão detectada', c: 'text-gold' },
  { t: '✓ você está no controle de tudo', c: 'text-gold-bright' },
]

function Terminal() {
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setVisible((v) => (v >= TERMINAL_LINES.length ? v : v + 1))
    }, 700)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="glass-strong w-full max-w-sm rounded-2xl p-5 font-mono text-[12px] leading-relaxed shadow-2xl">
      <div className="mb-4 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-graphite-soft" />
        <span className="h-2.5 w-2.5 rounded-full bg-graphite-soft" />
        <span className="ml-3 text-[10px] uppercase tracking-widest2 text-silver-dim">
          whitaker · terminal
        </span>
      </div>
      <div className="space-y-1.5">
        {TERMINAL_LINES.slice(0, visible).map((l, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={l.c}
          >
            {l.t}
          </motion.p>
        ))}
        <span className="inline-block h-3.5 w-2 animate-pulseGlow bg-gold-bright align-middle" />
      </div>
    </div>
  )
}

function FloatingStat({ className, label, value, prefix, suffix, decimals }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1 }}
      className={`glass absolute hidden rounded-2xl px-5 py-3.5 lg:block ${className}`}
    >
      <p className="font-display text-2xl text-gold-bright">
        <CountUp
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-silver-dim">
        {label}
      </p>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section
      id="plataforma"
      className="relative flex min-h-screen items-center overflow-hidden pt-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* Left: copy */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-gold-bright" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-silver-dim">
              Conectado ao seu celular · via MCP
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl font-medium leading-[1.05] tracking-tightest text-balance text-silver sm:text-5xl lg:text-6xl"
          >
            A Inteligência Artificial que{' '}
            <span className="text-gold-gradient">Avisa Você Antes</span>{' '}
            de Cada Operação Acontecer.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-silver-dim sm:text-lg"
          >
            O Whitaker é um MCP que se conecta ao seu celular, monitora tudo em
            tempo real e envia avisos prévios sobre cada cobrança, transação e
            movimentação — antes que ela aconteça. Você sempre um passo à frente
            do seu dinheiro.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <ShimmerButton href="#acesso" variant="gold">
              Solicitar Convite
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ShimmerButton>
            <ShimmerButton href="#ia" variant="outline">
              Conhecer a Plataforma
            </ShimmerButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-12 flex items-center gap-8 border-t border-white/5 pt-6"
          >
            <div>
              <p className="font-display text-2xl text-silver">
                <CountUp value={48} suffix="h" />
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-silver-dim">
                antecedência média
              </p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="font-display text-2xl text-silver">
                <CountUp value={1.4} decimals={1} suffix="M" />
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-silver-dim">
                operações monitoradas
              </p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="font-display text-2xl text-silver">24/7</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-silver-dim">
                monitoramento
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right: globe + floating UI */}
        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
          <div className="absolute inset-0">
            <Suspense fallback={<div className="grid h-full place-items-center text-silver-dim">inicializando núcleo…</div>}>
              <Globe />
            </Suspense>
          </div>

          <div className="absolute bottom-2 left-0 z-10 sm:bottom-8 sm:left-2">
            <Terminal />
          </div>

          <FloatingStat
            className="right-0 top-6"
            label="avisos prévios hoje"
            value={47}
          />
          <FloatingStat
            className="right-6 bottom-16"
            label="valor protegido"
            value={12.8}
            prefix="R$ "
            suffix="k"
            decimals={1}
          />
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] uppercase tracking-widest2 text-silver-dim">
          explore
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent" />
      </motion.div>
    </section>
  )
}
