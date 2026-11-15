import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { profile } from '../data/profile.js'
import { assetUrl } from '../assetUrl.js'

const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src)

const normalize = (bg) => {
  if (!bg) return []
  const list = Array.isArray(bg) ? bg : [bg]
  return list.map((s) => (typeof s === 'string' ? { src: s } : s))
}

// Фон на весь экран: сцены-гифки, которые сменяют друг друга при прокрутке,
// поверх — дрейфующий туман, пыль, виньетка, мерцание старой плёнки и зерно.
export default function Background() {
  const scenes = normalize(profile.background)
  const { scrollYProgress } = useScroll()
  const parallax = useMouseParallax()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      {/* сцены слегка следуют за мышью — появляется глубина */}
      <motion.div className="film-flicker absolute inset-0" style={parallax}>
        {scenes.map((scene, i) => (
          <Scene key={scene.src} scene={scene} index={i} total={scenes.length} progress={scrollYProgress} />
        ))}
      </motion.div>

      {/* затемнение, чтобы текст читался */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/45 to-ink/85" />
      <Lightning />
      {/* дрейфующий туман */}
      <div className="fog fog-a absolute -inset-x-1/2 bottom-[-10%] h-2/3" />
      <div className="fog fog-b absolute -inset-x-1/2 bottom-[-20%] h-1/2" />
      {/* виньетка */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,6,0.9)_100%)]" />
      <Dust />
      <div className="grain absolute -inset-[50%] opacity-[0.09]" />
    </div>
  )
}

// Параллакс: фон смещается на ~1.2% ширины экрана вслед за мышью (только мышь, не тач)
function useMouseParallax() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 40, damping: 20 })
  const y = useSpring(my, { stiffness: 40, damping: 20 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    const onMove = (e) => {
      const k = window.innerWidth * 0.012
      mx.set(-((e.clientX / window.innerWidth) * 2 - 1) * k)
      my.set(-((e.clientY / window.innerHeight) * 2 - 1) * k * 0.6)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my])

  return { x, y }
}

// Молния: раз в 20–40 секунд облака вспыхивают — одиночной или двойной вспышкой,
// свет идёт из случайной точки в верхней части неба.
function Lightning() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer = 0
    let anim = null

    const strike = () => {
      const el = ref.current
      if (!el) return
      const x = 20 + Math.random() * 60
      const y = 5 + Math.random() * 25
      el.style.background = `radial-gradient(ellipse 70% 55% at ${x}% ${y}%, rgba(235,238,255,0.95), rgba(200,205,230,0.35) 45%, transparent 75%)`
      const double = Math.random() < 0.55
      const steps = double ? [0, 0.75, 0.1, 0.05, 0.9, 0.25, 0] : [0, 0.85, 0.2, 0.45, 0]
      // встроенная анимация браузера (Web Animations API): идёт на видеокарте и не грузит JS
      anim = el.animate(
        steps.map((opacity) => ({ opacity })),
        { duration: double ? 1100 : 800, easing: 'linear' },
      )
      schedule(20000 + Math.random() * 20000)
    }
    const schedule = (ms) => {
      timer = setTimeout(strike, ms)
    }
    schedule(5000 + Math.random() * 3000) // первая — вскоре после загрузки

    return () => {
      clearTimeout(timer)
      anim?.cancel()
    }
  }, [])

  return <div ref={ref} className="absolute inset-0 opacity-0 mix-blend-screen" />
}

// Одна сцена. Каждая следующая лежит поверх предыдущей и проявляется на своём отрезке прокрутки.
function Scene({ scene, index, total, progress }) {
  const start = Math.min(Math.max(scene.from ?? index / total, 0), 1)
  const fade = Math.min(0.12, start)
  // Диапазоны всегда задаём от 0 до 1: Motion отдаёт их браузеру (ScrollTimeline),
  // а тот сам «достраивает» недостающие края и портит значения.
  // Первая сцена видна всегда, остальные проявляются поверх.
  const opacity = useTransform(
    progress,
    index === 0 ? [0, 1] : [0, start - fade, start, 1],
    index === 0 ? [1, 1] : [0, 0, 1, 1],
  )
  // лёгкий «наезд камеры» по мере прокрутки
  const scale = useTransform(progress, [0, start, 1], [1.06, 1.06, 1.14])

  const common = {
    className: 'absolute inset-0 h-full w-full object-cover',
    style: {
      objectPosition: scene.position ?? '50% 50%',
      filter: `grayscale(1) contrast(1.12) brightness(${scene.brightness ?? 0.72})`,
    },
  }

  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale }}>
      {isVideo(scene.src) ? (
        <video {...common} src={assetUrl(scene.src)} poster={assetUrl(scene.poster)} autoPlay muted loop playsInline preload="auto" />
      ) : (
        <img {...common} src={assetUrl(scene.src)} alt="" />
      )}
    </motion.div>
  )
}

// Медленно оседающая пыль / пепел в лунном свете
function Dust({ count = 70 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -10,
      r: Math.random() * 1.3 + 0.3,
      vy: Math.random() * 0.22 + 0.06,
      vx: Math.random() * 0.25 + 0.05,
      drift: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.45 + 0.15,
    })
    const parts = Array.from({ length: count }, () => spawn(true))

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#e4e1da'
      for (const p of parts) {
        if (!reduce) {
          p.y += p.vy
          p.x += p.vx + Math.sin(t / 1800 + p.drift) * 0.2
          if (p.y > h + 10 || p.x > w + 10) Object.assign(p, spawn(false), { x: Math.random() * w - 40 })
        }
        ctx.globalAlpha = p.alpha * (0.7 + Math.sin(t / 900 + p.drift * 3) * 0.3)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />
}
