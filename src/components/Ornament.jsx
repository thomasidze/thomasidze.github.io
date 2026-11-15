import { useEffect, useRef } from 'react'
import { useInView } from 'motion/react'
import { animate, createDrawable, stagger } from 'animejs'

// Готический орнамент-разделитель, который «прорисовывается» пером (anime.js createDrawable)
export default function Ornament({ className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const paths = ref.current.querySelectorAll('[data-draw]')
    const anim = animate(createDrawable(paths), {
      draw: ['0.5 0.5', '0 1'],
      duration: 1600,
      delay: stagger(120, { start: delay }),
      ease: 'inOutQuart',
    })
    return () => anim.revert?.()
  }, [inView, delay])

  return (
    <svg
      ref={ref}
      viewBox="0 0 320 24"
      fill="none"
      aria-hidden
      className={`h-6 w-72 max-w-full text-pewter ${className}`}
    >
      <path data-draw d="M4 12 H128" stroke="currentColor" strokeWidth="1" />
      <path data-draw d="M192 12 H316" stroke="currentColor" strokeWidth="1" />
      <path
        data-draw
        d="M128 12 C136 4 146 4 150 12 C146 20 136 20 128 12 Z M192 12 C184 4 174 4 170 12 C174 20 184 20 192 12 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path data-draw d="M160 2 L168 12 L160 22 L152 12 Z" stroke="#b3202e" strokeWidth="1.2" />
      <circle cx="160" cy="12" r="1.8" fill="#b3202e" />
    </svg>
  )
}
