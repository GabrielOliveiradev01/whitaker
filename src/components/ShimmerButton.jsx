// Premium button with a light sweep ("light running through") on hover.
// Two variants: solid gold and outlined glass.
export default function ShimmerButton({
  children,
  variant = 'gold',
  href = '#',
  className = '',
  onClick,
  external = false,
}) {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-all duration-500 will-change-transform'

  const styles =
    variant === 'gold'
      ? 'bg-gold-gradient text-ink-900 shadow-[0_8px_40px_-8px_rgba(200,169,106,0.6)] hover:shadow-[0_10px_60px_-6px_rgba(200,169,106,0.85)] hover:-translate-y-0.5'
      : 'glass text-silver hover:border-gold/50 hover:text-gold-bright hover:-translate-y-0.5'

  return (
    <a
      href={href}
      onClick={onClick}
      {...externalProps}
      className={`${base} ${styles} ${className}`}
    >
      {/* light sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </a>
  )
}
