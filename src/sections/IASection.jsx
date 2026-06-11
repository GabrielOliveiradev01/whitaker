import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

const CARDS = [
  {
    title: 'Monitoramento Contínuo',
    desc: 'O Whitaker varre o mercado de milhas, passagens, carros, locações e gift cards 24 horas por dia, sem parar.',
    icon: (
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Zm9-5v5l3 2" />
    ),
  },
  {
    title: 'Oportunidades em Tempo Real',
    desc: 'Você é avisado no instante em que surge uma passagem, diária, locação ou gift abaixo do preço de mercado.',
    icon: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
  },
  {
    title: 'Curadoria Inteligente',
    desc: 'A IA filtra o ruído e entrega só as ofertas que realmente valem a pena para o seu perfil e seus objetivos.',
    icon: (
      <>
        <path d="M3 13h4l3 7 4-16 3 9h4" />
      </>
    ),
  },
  {
    title: 'Vantagem Antecipada',
    desc: 'As melhores oportunidades duram pouco. O Whitaker te coloca na frente, antes que a multidão chegue.',
    icon: (
      <>
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
      </>
    ),
  },
]

function Icon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      {children}
    </svg>
  )
}

export default function IASection() {
  return (
    <section id="ia" className="relative overflow-hidden px-6 py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px hairline opacity-40" />

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="mb-6 text-[12px] uppercase tracking-widest2 text-gold">
              — Inteligência Artificial —
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl font-medium leading-tight tracking-tightest text-balance text-silver sm:text-6xl">
              Sua Inteligência Artificial{' '}
              <span className="text-gold-gradient">Nunca Dorme.</span>
            </h2>
          </Reveal>
        </div>

        {/* connecting node + lines */}
        <div className="relative mt-20" style={{ perspective: 1200 }}>
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[2px] w-[78%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent lg:block" />
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/20 to-transparent lg:block" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.12} className="h-full">
                <TiltCard className="h-full">
                  <div className="glass relative flex h-full flex-col rounded-2xl p-7 transition-all duration-500 hover:border-gold/40 hover:shadow-[0_30px_80px_-20px_rgba(200,169,106,0.35)]">
                    <div className="mb-6 grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-graphite-light to-ink-700 text-gold-bright ring-1 ring-white/5 transition-all duration-500 group-hover:text-gold-bright group-hover:ring-gold/40">
                      <Icon>{c.icon}</Icon>
                    </div>
                    <h3 className="font-display text-2xl text-silver">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-silver-dim">
                      {c.desc}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      ativo
                      <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-gold-bright" />
                    </span>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
