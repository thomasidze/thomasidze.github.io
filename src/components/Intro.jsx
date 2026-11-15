import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const SEEN_KEY = 'intro-seen'

// Пока идёт заставка, страницу нельзя прокрутить
const lockScroll = (locked) => {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

// Показывать ли заставку: один раз за сессию и не при «уменьшении движения»
export function shouldShowIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !sessionStorage.getItem(SEEN_KEY)
  } catch {
    return true
  }
}

const ease = [0.76, 0, 0.24, 1]

// Заставка: в темноте разгорается крест, затем тьма расходится, как занавес.
// onReveal — момент, когда занавес начинает открываться (под ним запускается страница),
// onDone — заставка полностью ушла.
export default function Intro({ onReveal, onDone }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    lockScroll(true)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* приватный режим — просто покажем заставку снова */
    }
    const t1 = setTimeout(() => {
      setOpen(true)
      onReveal()
    }, 1400)
    const t2 = setTimeout(() => {
      lockScroll(false)
      onDone()
    }, 2500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      lockScroll(false)
    }
  }, [onReveal, onDone])

  return (
    <div aria-hidden className="fixed inset-0 z-[70]">
      {/* две половины «занавеса» */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
        animate={open ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 1, ease }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
        animate={open ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 1, ease }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={open ? { opacity: 0, scale: 1.6, filter: 'blur(12px)' } : {}}
        transition={{ duration: 0.7, ease: 'easeIn' }}
      >
        {/* крест разгорается неровно, как свеча */}
        <motion.span
          className="font-display text-8xl leading-none text-ember sm:text-9xl"
          initial={{ opacity: 0, textShadow: '0 0 0px rgba(179,32,46,0)' }}
          animate={{
            opacity: [0, 0.7, 0.2, 0.9, 0.5, 1],
            textShadow: [
              '0 0 0px rgba(179,32,46,0)',
              '0 0 30px rgba(179,32,46,0.8)',
              '0 0 10px rgba(179,32,46,0.4)',
              '0 0 40px rgba(179,32,46,0.9)',
              '0 0 20px rgba(179,32,46,0.6)',
              '0 0 36px rgba(179,32,46,0.85)',
            ],
          }}
          transition={{ duration: 1.1, times: [0, 0.15, 0.3, 0.5, 0.7, 1], ease: 'linear' }}
        >
          ✠
        </motion.span>
        <motion.span
          className="mt-6 block h-px w-48 origin-center bg-gradient-to-r from-transparent via-bone/60 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </div>
  )
}
