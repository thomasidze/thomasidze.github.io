import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

const links = [
  { id: 'about', label: 'Обо мне' },
  { id: 'projects', label: 'Проекты' },
  { id: 'activity', label: 'GitHub' },
  { id: 'contacts', label: 'Контакты' },
]

export default function Nav() {
  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  // Подсветка пункта меню для секции, которая сейчас на экране
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const s of document.querySelectorAll('main section[id]')) observer.observe(s)
    return () => observer.disconnect()
  }, [])

  const pill = hovered ?? active

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-w-full items-center gap-1 overflow-hidden rounded-full border border-bone/10 bg-ink/60 p-1 backdrop-blur-md"
        onMouseLeave={() => setHovered(null)}
      >
        <a href="#top" className="hidden px-3 font-display text-xl text-ember sm:block" aria-label="Наверх">
          ✠
        </a>
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onMouseEnter={() => setHovered(l.id)}
            className={`relative whitespace-nowrap rounded-full px-2.5 py-1.5 font-caps text-[13px] tracking-wider transition-colors sm:px-4 sm:text-base sm:tracking-widest ${
              active === l.id ? 'text-bone' : 'text-ash hover:text-bone'
            }`}
          >
            {pill === l.id && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 -z-10 rounded-full bg-bone/10 ring-1 ring-bone/25"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {l.label}
          </a>
        ))}
        {/* полоска прогресса прокрутки */}
        <motion.span
          style={{ scaleX: progress }}
          className="absolute inset-x-4 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-bone/70 to-transparent"
        />
      </motion.nav>
    </header>
  )
}
