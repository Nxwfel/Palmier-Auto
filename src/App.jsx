import React , {useEffect} from 'react'
import Lenis from 'lenis'
import LandingPage from './Pages/LandingPage.jsx'
import About from './Pages/About.jsx'
import InventoryFlex from './Pages/Inventoryflex.jsx'
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
    <div className='min-h-screen w-screen bg-emerald-700 overflow-hidden'>
      <LandingPage />
      <About />
      <InventoryFlex />
    </div>
  )
}

export default App