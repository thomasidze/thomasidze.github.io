import Reveal from './Reveal.jsx'
import Ornament from './Ornament.jsx'

export default function SectionTitle({ numeral, title, subtitle }) {
  return (
    <div className="mb-14 flex flex-col items-center text-center">
      <Reveal>
        <span className="font-caps text-4xl tracking-[0.2em] text-ember text-glow">{numeral}</span>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-2 font-caps text-4xl tracking-[0.25em] text-bone sm:text-5xl">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className="mt-3 max-w-xl text-lg italic text-ash">{subtitle}</p>
        </Reveal>
      )}
      <Ornament className="mt-6" delay={300} />
    </div>
  )
}
