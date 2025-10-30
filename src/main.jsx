import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inventory from './Pages/Inventory.jsx'
import CarDetails from './Pages/CarDetails.jsx'
import UserAccount from './Pages/UserAccount.jsx'
import AuthPage from './Pages/Authpage.jsx'
import Admin from './Pages/Admin.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/auth' element={<AuthPage/>} />
        <Route path='/admin' element={<Admin/>} />
        <Route path='/inventory' element={<Inventory/>} />
        <Route path='/car/:id' element={<CarDetails/>} />
        <Route path='/account' element={<UserAccount/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
