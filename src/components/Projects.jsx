import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { projects } from '../data/profile.js'
import SectionTitle from './SectionTitle.jsx'
import { Icon } from './Icons.jsx'
import { assetUrl } from '../assetUrl.js'
import Magnetic from './Magnetic.jsx'

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <SectionTitle numeral="II" title="Проекты" subtitle="То, что я сделал и чем могу похвастаться" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: (i % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectCard project={p} index={i} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// Карточка с подсветкой под курсором (SpotlightCard из React Bits) и лёгким 3D-наклоном
function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), { stiffness: 200, damping: 20 })
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, rgba(228,225,218,0.09), transparent 70%)`

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    mx.set(-200)
    my.set(-200)
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative flex h-full flex-col overflow-hidden border border-bone/10 bg-crypt/70 backdrop-blur-sm transition-colors duration-500 hover:border-bone/30"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: spotlight }} />
      <Corners />
      <span aria-hidden className="ember-border z-30" />

      <div className="relative aspect-[16/9] overflow-hidden border-b border-bone/10 bg-gradient-to-br from-bone/[0.06] via-ink to-ink">
        {project.image ? (
          <img
            src={assetUrl(project.image)}
            alt={project.title}
            className="h-full w-full object-cover opacity-75 brightness-75 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:brightness-100 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-caps text-8xl tracking-[0.1em] text-bone/10 transition duration-700 group-hover:text-bone/30 group-hover:text-glow">
              {roman[index] ?? index + 1}
            </span>
          </div>
        )}
        <span className="absolute right-4 top-3 bg-ink/70 px-2 py-0.5 font-mono text-xs tracking-[0.3em] text-ash backdrop-blur-sm">
          {project.year}
        </span>
        <StatusBadge status={project.status} version={project.version} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-caps text-2xl tracking-[0.12em] text-bone">{project.title}</h3>
        <p className="mt-3 flex-1 text-lg text-bone/75">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <li key={t} className="border border-bone/10 px-2 py-0.5 font-mono text-xs text-ash">
              {t}
            </li>
          ))}
        </ul>
        <div className="relative z-20 mt-6 flex gap-5">
          {project.github && (
            <Magnetic strength={0.4}>
            <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-caps tracking-widest text-ash transition hover:text-ember">
              <Icon name="github" className="h-4 w-4" /> Код
            </a>
            </Magnetic>
          )}
          {project.demo && (
            <Magnetic strength={0.4}>
            <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-caps tracking-widest text-ash transition hover:text-ember">
              <Icon name="external" className="h-4 w-4" /> {project.demoLabel ?? 'Демо'}
            </a>
            </Magnetic>
          )}
        </div>
      </div>
    </motion.article>
  )
}

const statuses = {
  dev: { label: 'В разработке', dot: 'bg-ember', ring: 'border-ember/50', pulse: 'animate-ping' },
  live: { label: 'Вышел · обновляется', dot: 'bg-bone', ring: 'border-bone/40', pulse: 'animate-pulse' },
  done: { label: 'Завершён', dot: 'bg-bone/60', ring: 'border-bone/20', pulse: null },
}

// Плашка статуса: «В разработке» с пульсирующей красной точкой (как «запись» / «в эфире») или «Завершён»
function StatusBadge({ status, version }) {
  const s = statuses[status]
  if (!s) return null
  return (
    <span
      className={`absolute bottom-3 left-4 z-20 inline-flex items-center gap-2 border ${s.ring} bg-ink/75 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/90 backdrop-blur-sm`}
    >
      <span className="relative flex h-2 w-2">
        {s.pulse && <span className={`absolute -inset-0.5 inline-flex rounded-full ${s.pulse} ${s.dot} opacity-60`} />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
      </span>
      {s.label}
      {version && <span className="text-ash">· {version}</span>}
    </span>
  )
}

// Угловые орнаменты, которые «разгораются» при наведении
function Corners() {
  const c = 'pointer-events-none absolute z-20 h-5 w-5 border-pewter/40 transition-all duration-500 group-hover:h-8 group-hover:w-8 group-hover:border-bone/70'
  return (
    <>
      <span className={`${c} left-2 top-2 border-l border-t`} />
      <span className={`${c} right-2 top-2 border-r border-t`} />
      <span className={`${c} bottom-2 left-2 border-b border-l`} />
      <span className={`${c} bottom-2 right-2 border-b border-r`} />
    </>
  )
}
