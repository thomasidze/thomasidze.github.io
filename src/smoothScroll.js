import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Плавная прокрутка с инерцией (Lenis). Работает только на компьютере с колёсиком/тачпадом:
// на телефонах остаётся родная прокрутка, а при «уменьшении движения» Lenis не включается.
let lenis = null

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.09,
    anchors: { offset: -80 }, // ссылки меню (#about и т.п.) — тоже плавно, с отступом под шапку
    allowNestedScroll: true, // календарь GitHub прокручивается вбок сам по себе
  })
  return lenis
}

// Заставка блокирует прокрутку, пока идёт
export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
