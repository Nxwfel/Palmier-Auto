import React , {useEffect} from 'react'
import {motion} from 'framer-motion'
import Lenis from 'lenis'
import LandingPage from './Pages/LandingPage.jsx'
import About from './Pages/About.jsx'
import InventoryFlex from './Pages/Inventoryflex.jsx'
import Contact from './Pages/Contact.jsx'
import './index.css'
const App = () => {

    useEffect( () => {
    const lenis = new Lenis()
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

  }, [])
  return (
    <motion.div
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
    transition={{duration:1}}
    className='min-h-screen w-screen overflow-hidden'>
      <LandingPage />
      <InventoryFlex />
      <About />
      <Contact />
    </motion.div>
  )
}

export default App