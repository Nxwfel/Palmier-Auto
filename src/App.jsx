import React , {useEffect} from 'react'
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
    <div className='min-h-screen w-screen overflow-hidden'>
      <LandingPage />
      <InventoryFlex />
      <About />
      <Contact />
    </div>
  )
}

export default App