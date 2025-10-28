import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Inventory from './Pages/Inventory.jsx'
import CarDetails from './Pages/CarDetails.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarDetails />
  </StrictMode>,
)
