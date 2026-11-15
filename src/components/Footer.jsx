import { profile } from '../data/profile.js'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-bone/10 px-4 py-10 text-center">
      <p className="font-display text-2xl text-bone/70">{profile.name}</p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-ash">
        © {new Date().getFullYear()} · сделано при свечах и с Claude Code
      </p>
    </footer>
  )
}
