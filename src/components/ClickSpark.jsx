import { useEffect, useRef } from 'react'

// Искры по клику (идея — ClickSpark из React Bits), рисуются на одном canvas поверх страницы.
export default function ClickSpark({ color = '#d23a3f', count = 10, radius = 26, duration = 450 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let sparks = []
    let raf = 0

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const ease = (t) => t * (2 - t)
    const loop = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparks = sparks.filter((s) => now - s.start < duration)
      for (const s of sparks) {
        const p = ease((now - s.start) / duration)
        const dist = p * radius
        const len = 9 * (1 - p)
        const x1 = s.x + dist * Math.cos(s.angle)
        const y1 = s.y + dist * Math.sin(s.angle)
        ctx.strokeStyle = color
        ctx.globalAlpha = 1 - p
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x1 + len * Math.cos(s.angle), y1 + len * Math.sin(s.angle))
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      raf = sparks.length ? requestAnimationFrame(loop) : 0
    }

    const onClick = (e) => {
      const start = performance.now()
      for (let i = 0; i < count; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / count, start })
      }
      if (!raf) raf = requestAnimationFrame(loop)
    }

    window.addEventListener('click', onClick)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('click', onClick)
      window.removeEventListener('resize', resize)
    }
  }, [color, count, radius, duration])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-50 h-full w-full" />
}
