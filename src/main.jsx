import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Account from './Pages/UserAccount.jsx'
import CarDetails from './Pages/CarDetails.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Account />
  </StrictMode>,
)
