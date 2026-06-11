import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Reveal from '../components/Reveal'

export default function Exclusividade() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['12%', '-12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.2, 1, 1, 0.3])

  return (
    <section
      id="exclusividade"
      ref={ref}
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-32"
    >
      {/* giant watermark word */}
      <motion.span
        style={{ y }}
        aria-hidden
        className="pointer-events-none absolute select-none font-display text-[26vw] font-semibold leading-none text-white/[0.015]"
      >
        WHITAKER
      </motion.span>

      <motion.div style={{ opacity }} className="relative z-10 text-center">
        <Reveal>
          <p className="mb-8 text-[12px] uppercase tracking-widest2 text-gold">
            — Exclusividade —
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-5xl font-medium leading-[1.02] tracking-tightest text-balance text-silver sm:text-7xl lg:text-[6.5rem]">
            Não Foi Criado
            <br />
            <span className="text-gold-gradient">Para Todos.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-silver-dim">
            O Whitaker foi desenvolvido para quem quer estar sempre à frente no
            mercado de milhas — encontrando passagens, carros, locações e gift
            cards antes de todo mundo.
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mx-auto mt-14 h-px w-40 hairline" />
        </Reveal>
      </motion.div>
    </section>
  )
}
