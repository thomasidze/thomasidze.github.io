import { motion } from 'motion/react'
import { profile } from '../data/profile.js'
import SectionTitle from './SectionTitle.jsx'
import Reveal from './Reveal.jsx'
import { assetUrl } from '../assetUrl.js'

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <SectionTitle numeral="I" title="Обо мне" subtitle="Кто я и чем занимаюсь" />

      <div className="grid items-center gap-14 md:grid-cols-[minmax(0,320px)_1fr]">
        <Reveal className="mx-auto w-full max-w-[320px]">
          <ArchPortrait />
        </Reveal>

        <div>
          {profile.about.map((p, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <p className={`mb-5 text-xl leading-relaxed text-bone/90 ${i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-caps first-letter:text-[4.6rem] first-letter:leading-[0.85] first-letter:text-ember' : ''}`}>
                {p}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <dl className="mt-8 grid gap-px overflow-hidden border border-bone/10 bg-bone/10 sm:grid-cols-3">
              {profile.facts.map((f) => (
                <div key={f.label} className="bg-ink/80 p-4 backdrop-blur-sm">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-ash">{f.label}</dt>
                  <dd className="mt-1 text-lg text-bone">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <motion.ul
            className="mt-8 flex flex-wrap gap-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
          >
            {profile.skills.map((s) => (
              <motion.li
                key={s}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                whileHover={{ y: -3 }}
                className="cursor-default border border-pewter/30 bg-crypt/70 px-3 py-1 font-mono text-sm text-bone/80 transition-colors hover:border-bone/50 hover:text-bone"
              >
                {s}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

// Портрет в стрельчатой арке, как витраж
function ArchPortrait() {
  const initial = (profile.name.trim()[0] ?? '?').toUpperCase()
  return (
    <div className="relative aspect-[3/4]">
      <div className="absolute -inset-3 rounded-t-[999px] border border-pewter/30" />
      <div className="absolute -inset-1.5 rounded-t-[999px] border border-bone/10" />
      <div className="relative h-full overflow-hidden rounded-t-[999px] border border-bone/15 bg-gradient-to-b from-bone/10 via-crypt to-ink">
        {profile.avatar ? (
          <img src={assetUrl(profile.avatar)} alt={profile.name} className="h-full w-full object-cover grayscale-[35%] sepia-[15%]" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-[9rem] leading-none text-bone/80 text-glow">{initial}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
      </div>
      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-ink px-3 font-mono text-xs uppercase tracking-[0.3em] text-ash">
        {profile.location}
      </span>
    </div>
  )
}
