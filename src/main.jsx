import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inventory from './Pages/Inventory.jsx'
import CarDetails from './Pages/CarDetails.jsx'
import UserAccount from './Pages/UserAccount.jsx'
import AuthPage from './Pages/Authpage.jsx'
import AdminSuperPanel from './Pages/Admin.jsx'
import App from './App.jsx'
import Commercials from './Pages/Commercials.jsx'
import Accountant from './Pages/Accountant.jsx'
import MarketingAgent from './Pages/MarketingAgent.jsx'
import SuperAdminLogin from './Pages/SuperAdminLogin.jsx'
import AdminsLogin from './Pages/AdminsLogin.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/auth' element={<AuthPage/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminSuperPanel />} />
        </Route>
        <Route path='/inventory' element={<Inventory/>} />
        <Route path='/car' element={<CarDetails/>} />
        <Route path='/account' element={<UserAccount/>} />
        <Route path='/adminlogin' element={<SuperAdminLogin/>} />
        <Route path='*' element={<h1 className='text-center mt-20 text-3xl'>404 - Page Not Found</h1>} />
        <Route path='/commercials' element={<Commercials/>} />
        <Route path='/adminslogin' element={<AdminsLogin/>} />
        <Route path='/accountant' element={<Accountant/>} />
        <Route path='/marketing' element={<MarketingAgent/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
