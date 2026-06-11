import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import ShimmerButton from '../components/ShimmerButton'
import GoldParticles from '../components/GoldParticles'
import { waLink } from '../lib/contact'

export default function NinetyDays() {
  return (
    <section className="relative overflow-hidden px-6 py-28">
      <GoldParticles density={0.00006} />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      <Reveal className="relative mx-auto max-w-4xl">
        <div className="glass-strong relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16">
          <span className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-gold/[0.07] blur-3xl" />

          <p className="mb-5 text-[12px] uppercase tracking-widest2 text-gold">
            — Oferta de fundação —
          </p>

          <h2 className="font-display text-6xl font-semibold leading-none tracking-tightest text-silver sm:text-8xl">
            <CountUp value={90} className="text-gold-gradient" />
            <span className="text-gold-gradient"> Dias</span>
            <br />
            Gratuitos
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-silver-dim">
            A maioria dos nossos usuários alcança resultados expressivos nos
            primeiros meses de utilização.{' '}
            <span className="text-silver">Agora é a sua vez.</span>
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-silver-dim">
            Ative seu acesso gratuito e descubra por que nossa Inteligência
            Artificial está mudando a forma como as pessoas encontram as
            melhores oportunidades de milhas.
          </p>

          <div className="mt-10 flex justify-center">
            <ShimmerButton
              href={waLink('Olá! Quero ativar meus 90 dias gratuitos no aplicativo Whitaker.')}
              external
              variant="gold"
              className="px-10 py-4 text-base"
            >
              Começar Agora
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ShimmerButton>
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-silver-dim">
            sem cartão de crédito · cancele quando quiser
          </p>
        </div>
      </Reveal>
    </section>
  )
}
