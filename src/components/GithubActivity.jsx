import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'
import { GitHubCalendar } from 'react-github-calendar'
import 'react-github-calendar/tooltips.css'
import { profile } from '../data/profile.js'
import SectionTitle from './SectionTitle.jsx'
import Reveal from './Reveal.jsx'
import { Icon } from './Icons.jsx'

const theme = {
  dark: ['#141416', '#2e2d31', '#57555a', '#99958f', '#e4e1da'],
}

const labels = {
  months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  totalCount: '{{count}} коммитов за год',
  legend: { less: 'Меньше', more: 'Больше' },
}

const plural = (n, [one, few, many]) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

export default function GithubActivity() {
  const username = profile.githubUsername
  const [user, setUser] = useState(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`https://api.github.com/users/${username}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .catch(() => {})
    return () => ctrl.abort()
  }, [username])

  const stats = user
    ? [
        { label: 'репозиториев', value: user.public_repos },
        { label: 'подписчиков', value: user.followers },
        { label: 'на GitHub с', value: new Date(user.created_at).getFullYear(), plain: true },
      ]
    : []

  return (
    <section id="activity" className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <SectionTitle numeral="III" title="Летопись" subtitle="Моя активность на GitHub за последний год" />

      <Reveal>
        <div className="relative border border-bone/10 bg-crypt/70 p-5 backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3"
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full border border-bone/20 grayscale transition group-hover:grayscale-0" />
              ) : (
                <Icon name="github" className="h-8 w-8 text-bone/70" />
              )}
              <span className="font-mono text-bone transition group-hover:text-ember">@{username}</span>
            </a>
            <div className="flex gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-right">
                  <div className="font-display text-3xl text-bone">
                    {s.plain ? s.value : <Counter to={s.value} />}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto pb-2 font-mono text-ash [scrollbar-width:thin]">
            <GitHubCalendar
              username={username}
              colorScheme="dark"
              theme={theme}
              labels={labels}
              weekStart={1}
              blockSize={12}
              blockMargin={4}
              blockRadius={2}
              fontSize={13}
              errorMessage="Не удалось загрузить активность GitHub"
              tooltips={{
                activity: {
                  text: (a) =>
                    `${a.count} ${plural(a.count, ['коммит', 'коммита', 'коммитов'])} · ${new Date(a.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`,
                },
              }}
            />
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// Число, которое «досчитывается» при появлении на экране
function Counter({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString('ru-RU')
      },
    })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>0</span>
}
