import MobileBottomNav from './components/MobileBottomNav'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import About from './pages/About'
import Home from './pages/Home'
import InventionsPage from './pages/InventionsPage'
import Login from './pages/Login'
import PeoplePage from './pages/PeoplePage'
import PersonProfile from './pages/PersonProfile'
import PostDetail from './pages/PostDetail'
import Register from './pages/Register'
import TimelinePage from './pages/TimelinePage'

export default function App() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/people/:id" element={<PersonProfile />} />
        <Route path="/inventions" element={<InventionsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <MobileBottomNav />
    </div>
  )
}
