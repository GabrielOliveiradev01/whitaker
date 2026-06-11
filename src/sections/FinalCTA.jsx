import Reveal from '../components/Reveal'
import ShimmerButton from '../components/ShimmerButton'
import GoldParticles from '../components/GoldParticles'
import { waLink } from '../lib/contact'

export default function FinalCTA() {
  return (
    <section
      id="acesso"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <GoldParticles density={0.00008} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.05] blur-[120px]" />

      <div className="relative z-10 text-center">
        <Reveal>
          <p className="mb-8 text-[12px] uppercase tracking-widest2 text-gold">
            — O próximo capítulo —
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium leading-[1.08] tracking-tightest text-balance text-silver sm:text-6xl lg:text-7xl">
            O Futuro das Milhas{' '}
            <span className="text-gold-gradient">Já Existe.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex justify-center">
            <ShimmerButton
              href={waLink('Olá! Quero solicitar acesso ao aplicativo Whitaker.')}
              external
              variant="gold"
              className="px-12 py-5 text-base"
            >
              Solicitar Acesso
            </ShimmerButton>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <p className="mt-8 text-sm text-silver-dim">
            Vagas limitadas por temporada · Aprovação por convite
          </p>
        </Reveal>
      </div>
    </section>
  )
}
