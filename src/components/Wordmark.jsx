// The WHITAKER / I·A lockup as seen in the brand key art:
// wide-tracked "WHITAKER" with a centered "I A" framed by hairlines.
export default function Wordmark({ className = '', glow = false }) {
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <span
        className="font-display font-medium uppercase leading-none text-gold-gradient"
        style={{
          letterSpacing: '0.34em',
          fontSize: '1em',
          // nudge so the wide tracking stays optically centered
          textIndent: '0.34em',
          filter: glow
            ? 'drop-shadow(0 0 14px rgba(200,169,106,0.55))'
            : 'none',
        }}
      >
        Whitaker
      </span>
      <span className="mt-[0.45em] flex w-full items-center gap-[0.5em]">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
        <span
          className="font-display uppercase text-gold"
          style={{ letterSpacing: '0.5em', fontSize: '0.34em', textIndent: '0.5em' }}
        >
          IA
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
      </span>
    </div>
  )
}
