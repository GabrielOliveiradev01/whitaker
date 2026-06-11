import { motion, useScroll, useSpring } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import GoldParticles from './components/GoldParticles'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Exclusividade from './sections/Exclusividade'
import IASection from './sections/IASection'
import Status from './sections/Status'
import Download from './sections/Download'
import NinetyDays from './sections/NinetyDays'
import FinalCTA from './sections/FinalCTA'
import Footer from './sections/Footer'

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="relative min-h-screen bg-ink text-silver">
      {/* fixed ambient particles behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <GoldParticles density={0.00004} />
      </div>

      {/* film grain */}
      <div className="noise" />

      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gold-gradient"
      />

      <CustomCursor />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <Exclusividade />
        <IASection />
        <Status />
        <Download />
        <NinetyDays />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}
