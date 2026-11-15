import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { animate, scrambleText, splitText, stagger } from 'animejs'
import { profile } from '../data/profile.js'
import Ornament from './Ornament.jsx'

const year = new Date().getFullYear()
const toRoman = (n) =>
  [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ].reduce((acc, [v, s]) => {
    while (n >= v) { acc += s; n -= v }
    return acc
  }, '')

export default function Hero() {
  const nameRef = useRef(null)
  const roleRef = useRef(null)
  const kickerRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Имя: буквы поднимаются из темноты по очереди (anime.js splitText + stagger)
    const split = splitText(nameRef.current, { chars: true })
    const nameAnim = animate(split.chars, {
      y: ['60%', '0%'],
      rotate: [8, 0],
      opacity: [0, 1],
      filter: ['blur(12px)', 'blur(0px)'],
      duration: 1100,
      delay: stagger(55, { start: 250 }),
      ease: 'outExpo',
    })

    // Подзаголовки «расшифровываются» (anime.js scrambleText)
    const kickerAnim = animate(kickerRef.current, {
      innerHTML: scrambleText({ chars: 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ†✠', duration: 1200 }),
      delay: 100,
    })
    const roleAnim = animate(roleRef.current, {
      innerHTML: scrambleText({ chars: 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ†✠', duration: 1400 }),
      delay: 900,
    })

    return () => {
      nameAnim.revert()
      kickerAnim.revert()
      roleAnim.revert()
      split.revert()
    }
  }, [])

  return (
    <section id="top" className="relative flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <p ref={kickerRef} className="font-mono text-xs uppercase tracking-[0.4em] text-ash sm:text-sm">
        Portfolio · {toRoman(year)}
      </p>

      <h1
        ref={nameRef}
        className="mt-6 font-display text-6xl leading-[1.05] text-bone text-glow sm:text-8xl md:text-9xl"
      >
        {profile.name}
      </h1>

      <Ornament className="mt-8" delay={900} />

      <p ref={roleRef} className="mt-6 font-caps text-xl tracking-[0.3em] text-bone/70 sm:text-2xl">
        {profile.role}
      </p>

      <motion.p
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ delay: 1.6, duration: 1.2 }}
        className="mt-6 max-w-xl text-xl italic text-bone/80 sm:text-2xl"
      >
        «{profile.tagline}»
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        <a
          href="#projects"
          className="group relative overflow-hidden border border-bone bg-bone px-7 py-3 font-caps tracking-[0.2em] text-ink transition hover:shadow-[0_0_40px_rgba(228,225,218,0.35)]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          Смотреть проекты
        </a>
        <a
          href="#contacts"
          className="border border-bone/40 bg-ink/40 px-7 py-3 font-caps tracking-[0.2em] text-bone/85 backdrop-blur-sm transition hover:border-bone hover:text-bone"
        >
          Связаться
        </a>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Листать вниз"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-ash hover:text-bone"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.4em]">scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="block h-10 w-px bg-gradient-to-b from-bone/70 to-transparent"
        />
      </motion.a>
    </section>
  )
}
