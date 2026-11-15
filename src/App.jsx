import { useCallback, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import Background from './components/Background.jsx'
import ClickSpark from './components/ClickSpark.jsx'
import Intro, { shouldShowIntro } from './components/Intro.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import GithubActivity from './components/GithubActivity.jsx'
import Contacts from './components/Contacts.jsx'
import Footer from './components/Footer.jsx'
import { startSmoothScroll } from './smoothScroll.js'

// Ссылка вида /#projects ведёт сразу к разделу — заставку тогда не показываем
const initialHash = window.location.hash.slice(1)
const withIntro = !initialHash && shouldShowIntro()

export default function App() {
  const [intro, setIntro] = useState(withIntro) // заставка на экране
  const [ready, setReady] = useState(!withIntro) // страница смонтирована (анимации стартуют)

  const reveal = useCallback(() => setReady(true), [])
  const finish = useCallback(() => setIntro(false), [])

  useEffect(() => {
    startSmoothScroll()
  }, [])

  // при открытии ссылки вида /#projects — докрутить до секции после рендера
  useEffect(() => {
    if (ready && initialHash) document.getElementById(initialHash)?.scrollIntoView()
  }, [ready])

  return (
    <MotionConfig reducedMotion="user">
      <Background />
      <ClickSpark color="#e4e1da" />
      {intro && <Intro onReveal={reveal} onDone={finish} />}
      {ready && (
        <>
          <Nav />
          <main className="relative z-10">
            <Hero />
            <About />
            <Projects />
            <GithubActivity />
            <Contacts />
          </main>
          <Footer />
        </>
      )}
    </MotionConfig>
  )
}
