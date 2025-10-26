import React from 'react'
import LandingPage from './Pages/LandingPage'
import About from './Pages/About'
import './index.css'
const App = () => {
  return (
    <div className='min-h-screen w-screen bg-emerald-700 overflow-hidden'>
      <LandingPage />
      <About />
    </div>
  )
}

export default App