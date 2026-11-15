import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import Background from './components/Background.jsx'
import ClickSpark from './components/ClickSpark.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import GithubActivity from './components/GithubActivity.jsx'
import Contacts from './components/Contacts.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  // при открытии ссылки вида /#projects — докрутить до секции после рендера
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Background />
      <ClickSpark color="#e4e1da" />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <GithubActivity />
        <Contacts />
      </main>
      <Footer />
    </MotionConfig>
  )
}
