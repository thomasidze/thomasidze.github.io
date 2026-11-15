import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

// «Магнит»: элемент слегка тянется за курсором, пока тот над ним, и пружинит обратно.
// strength — какую долю смещения курсора от центра повторяет элемент.
export default function Magnetic({ children, strength = 0.3, className = 'inline-block' }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 })

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span ref={ref} className={className} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  )
}
