import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'

const ALERTS = [
  {
    tone: 'warn',
    title: 'Cobrança recorrente',
    sub: 'Netflix · R$ 55,90',
    when: 'em 2 dias',
    icon: (
      <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    ),
  },
  {
    tone: 'info',
    title: 'Fatura fecha amanhã',
    sub: 'Cartão final 4291 · revise 3 lançamentos',
    when: 'amanhã',
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </>
    ),
  },
  {
    tone: 'alert',
    title: 'Transação fora do padrão',
    sub: 'R$ 1.249,00 · compra online',
    when: 'agora',
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
        <path d="M12 8v4m0 4h.01" />
      </>
    ),
  },
  {
    tone: 'info',
    title: 'Assinatura vai subir de preço',
    sub: 'Spotify · +R$ 5,00 no próximo ciclo',
    when: 'em 5 dias',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
]

const toneStyles = {
  warn: 'text-gold-bright ring-gold/30',
  alert: 'text-gold-bright ring-gold/50',
  info: 'text-silver ring-white/10',
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] max-w-full">
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gold/[0.06] blur-3xl" />

      <div className="glass-strong relative aspect-[9/19] overflow-hidden rounded-[2.6rem] p-3 shadow-2xl ring-1 ring-white/10">
        {/* notch */}
        <div className="absolute left-1/2 top-3 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-ink-900" />

        <div className="flex h-full flex-col rounded-[2rem] bg-gradient-to-b from-ink-800 to-ink-900 p-4">
          {/* status bar */}
          <div className="mb-5 mt-1 flex items-center justify-between px-1 text-[10px] text-silver-dim">
            <span>9:41</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-gold-bright" />
              Whitaker ativo
            </span>
          </div>

          <p className="mb-3 px-1 text-[11px] uppercase tracking-[0.18em] text-silver-dim">
            Avisos prévios
          </p>

          <div className="space-y-3">
            {ALERTS.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3 + i * 0.18,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="glass flex items-start gap-3 rounded-2xl p-3"
              >
                <span
                  className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-700 ring-1 ${toneStyles[a.tone]}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    {a.icon}
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[12px] font-medium text-silver">
                      {a.title}
                    </p>
                    <span className="shrink-0 rounded-full bg-gold/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-gold-bright">
                      {a.when}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-silver-dim">
                    {a.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <div className="rounded-2xl bg-gold-gradient px-4 py-3 text-center text-[12px] font-medium text-ink-900">
              Tudo sob controle
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Status() {
  return (
    <section className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal direction="right">
          <div className="animate-floaty">
            <PhoneMockup />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-6 text-[12px] uppercase tracking-widest2 text-gold">
              — Controle —
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl font-medium leading-[1.1] tracking-tightest text-balance text-silver sm:text-5xl lg:text-6xl">
              O verdadeiro controle não é{' '}
              <span className="text-silver-dim">gastar menos.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 font-display text-3xl italic text-gold-gradient sm:text-4xl">
              É saber de cada operação antes que ela aconteça.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                'Avisos prévios em tempo real',
                'Zero surpresas na fatura',
                'Sempre um passo à frente',
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-sm text-silver-dim"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
