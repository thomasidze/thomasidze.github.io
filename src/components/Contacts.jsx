import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '../data/profile.js'
import SectionTitle from './SectionTitle.jsx'
import { Icon } from './Icons.jsx'

export default function Contacts() {
  return (
    <section id="contacts" className="mx-auto max-w-3xl px-4 py-28 sm:px-6">
      <SectionTitle numeral="IV" title="Контакты" subtitle="Пиши — отвечу, даже если за окном полночь" />

      <motion.ul
        className="flex flex-col"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        {profile.contacts.map((c) => (
          <motion.li
            key={c.type + (c.href ?? c.user)}
            variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContactRow contact={c} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}

function ContactRow({ contact }) {
  const [copied, setCopied] = useState(false)
  const isEmail = contact.type === 'email'
  // Почта хранится частями и собирается только в браузере: в коде сайта нет строки вида name@domain,
  // поэтому простые спам-боты, которые ищут адреса в HTML/JS, её не находят.
  const address = isEmail ? `${contact.user}\u0040${contact.domain}` : null
  const href = isEmail ? `mailto:${address}` : contact.href
  const label = isEmail ? address : contact.label

  const copy = async (e) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = href
    }
  }

  return (
    <div className="group relative flex items-center border-b border-bone/10">
      <a
        href={href}
        target={isEmail ? undefined : '_blank'}
        rel="noreferrer"
        className="relative flex flex-1 items-center gap-5 overflow-hidden py-6"
      >
        {/* полоса, которая заливает строку при наведении */}
        <span className="absolute inset-y-0 left-0 -z-10 w-0 bg-gradient-to-r from-bone/[0.08] to-transparent transition-all duration-500 group-hover:w-full" />
        <Icon name={contact.type} className="h-6 w-6 shrink-0 text-ash transition group-hover:text-ember" />
        <span className="font-caps text-2xl tracking-[0.12em] text-bone transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl">
          {label}
        </span>
        <span className="ml-auto pr-2 font-display text-2xl text-ember opacity-0 transition duration-500 group-hover:opacity-100">
          ✠
        </span>
      </a>
      {isEmail && (
        <button
          onClick={copy}
          className="relative ml-2 min-w-28 border border-bone/15 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ash transition hover:border-bone/50 hover:text-bone"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? 'ok' : 'copy'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="block"
            >
              {copied ? 'Скопировано' : 'Копировать'}
            </motion.span>
          </AnimatePresence>
        </button>
      )}
    </div>
  )
}
