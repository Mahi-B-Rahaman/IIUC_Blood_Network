 
import Register from './components/Register.tsx'
import { MainPage } from './components/MainPage.tsx'
import { BloodDashboard } from './components/BloodDashboard.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav.tsx'
import { Login } from './components/Login.tsx';
import NotFound from './NotFound.tsx';
import { BloodRequest } from './components/BloodRequest.tsx';
import { About } from './components/About.tsx';
import { AuthProvider } from './context/AuthContext.tsx';



function App() {


  return (
    <>
    
    <Router>
      <AuthProvider>
        <Nav/>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bloodrequest" element={<BloodRequest/>} />
          <Route path="/blooddashboard" element={<BloodDashboard/>} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </AuthProvider>
    </Router>
  
    </>
  )
}

export default App
