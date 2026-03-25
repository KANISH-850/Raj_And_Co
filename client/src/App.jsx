import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Tenders from './pages/Tenders'
import Accounts from './pages/Accounts'
import Salary from './pages/Salary'
import Contractors from './pages/Contractors'

function App() {
  return (
    <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/tenders" element={<Tenders />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/contractors" element={<Contractors />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </AnimatePresence>
  )
}

export default App
