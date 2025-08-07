import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/Home/DashboardPage';
import CitiesPage from './pages/Home/CitiesPage';
import POIsPage from './pages/Home/POIsPage';
import AdminsPage from './pages/Home/AdminsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cities"
            element={
              <ProtectedRoute>
                <CitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pois"
            element={
              <ProtectedRoute>
                <POIsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <ProtectedRoute requiredRole="SUPER_ADMIN">
                <AdminsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
