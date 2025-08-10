import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardContent from './components/contents/DashboardContent';
import CitiesContent from './components/contents/CitiesContent';
import POIsContent from './components/contents/POIsContent';
import AdminsContent from './components/contents/AdminsContent';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardContent />} />
            <Route path="/cities" element={<CitiesContent />} />
            <Route path="/pois" element={<POIsContent />} />
            <Route
              path="/admins"
              element={
                <ProtectedRoute requiredRole="SUPER_ADMIN">
                  <AdminsContent />
                </ProtectedRoute>
              }
            />
            <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
