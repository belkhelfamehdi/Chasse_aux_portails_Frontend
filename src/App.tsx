import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/Home/DashboardPage';
import CitiesPage from './pages/Home/CitiesPage';
import POIsPage from './pages/Home/POIsPage';
import AdminsPage from './pages/Home/AdminsPage';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (loginData: LoginFormData) => {
    console.log('Login data:', loginData);
    // Here you would typically make an API call to authenticate
    // For now, we'll just set the user as logged in
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<DashboardPage onLogout={handleLogout} />} />
            <Route path="/cities" element={<CitiesPage onLogout={handleLogout} />} />
            <Route path="/pois" element={<POIsPage onLogout={handleLogout} />} />
            <Route path="/admins" element={<AdminsPage onLogout={handleLogout} />} />
            <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
