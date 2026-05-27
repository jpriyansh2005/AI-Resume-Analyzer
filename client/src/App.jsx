import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedWrapper from './components/ProtectedWrapper';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import AnalysisResult from './pages/AnalysisResult';
import ResumeHistory from './pages/ResumeHistory';
import Profile from './pages/Profile';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedWrapper />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/upload" element={<UploadResume />} />
              <Route path="/dashboard/analysis/:id" element={<AnalysisResult />} />
              <Route path="/dashboard/history" element={<ResumeHistory />} />
              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1626',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
