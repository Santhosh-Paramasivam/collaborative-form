import Register from './Register'
import Navbar from './Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Login'
import AdminDashboard from './AdminDashboard/AdminDashboard'
import UserDashboard from './UserDashboard/UserDashboard'

function App() {
  return <div className="bg-body-secondary">
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/admin_dashboard' element={<AdminDashboard />}></Route>
        <Route path='/user_dashboard' element={<UserDashboard />}></Route>
      </Routes>
    </BrowserRouter>
  </div>
}

export default App
