import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import PendingApproval from './pages/auth/PendingApproval';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tenders from './pages/Tenders';
import Accounts from './pages/Accounts';
import Salary from './pages/Salary';
import Contractors from './pages/Contractors';
import UserApproval from './pages/admin/UserApproval';

function App() {
  return (
    <>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }} 
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/tenders" element={<Tenders />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/contractors" element={<Contractors />} />
            <Route path="/admin/users" element={<UserApproval />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </>
  );
}

export default App;
