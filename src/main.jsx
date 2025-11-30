// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inventory from './Pages/Inventory.jsx'
import CarDetails from './Pages/CarDetails.jsx'
import UserAccount from './Pages/UserAccount.jsx'
import AuthPage from './Pages/Authpage.jsx'
import AdminSuperPanel from './Pages/AdminO.jsx'
import App from './App.jsx'
import Commercials from './Pages/Commercials.jsx'
import Accountant from './Pages/Accountant.jsx'
import MarketingAgent from './Pages/MarketingAgent.jsx'
import AccountantLogin from './Pages/AccountantLogin.jsx'
import MarketingAgentLogin from './Pages/MarketingAgentLogin.jsx'
import CommercialsLogin from './Pages/CommercialsLogin.jsx'
import SuperAdminLogin from './Pages/SuperAdminLogin.jsx'
import AdminsLogin from './Pages/AdminsLogin.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx'
import CommercialsProtectedRoute from './Components/CommercialsProtectedRoute.jsx'
import AccountantProtectedRoute from './Components/AccountantProtectedRoute.jsx'
import MarketingProtectedRoute from './Components/MarketingProtectedRoute.jsx'
import OrderForm from './Pages/OrderForm.jsx' // Import the OrderForm component
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
        <Route path='/car/:id' element={<CarDetails/>} />
        <Route path='/account' element={<UserAccount/>} />
        <Route path='/adminlogin' element={<SuperAdminLogin/>} />
        <Route path='*' element={<h1 className='text-center mt-20 text-3xl'>404 - Page Not Found</h1>} />
        <Route path='/commercialslogin' element={<CommercialsLogin/>} />
        <Route element={<CommercialsProtectedRoute />}>
          <Route path="/commercials" element={<Commercials />} />
        </Route>
        <Route path='/adminslogin' element={<AdminsLogin/>} />
        <Route path='/accountantlogin' element={<AccountantLogin/>} />
        <Route path='/marketinglogin' element={<MarketingAgentLogin/>} />

        <Route element={<AccountantProtectedRoute />}>
          <Route path='/accountant' element={<Accountant/>} />
        </Route>

        <Route element={<MarketingProtectedRoute />}>
          <Route path='/marketing' element={<MarketingAgent/>} />
        </Route>

        {/* Add the new OrderForm route */}
        <Route path='/order' element={<OrderForm />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)