import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/Home/DashboardPage';
import CitiesPage from './pages/Home/CitiesPage';


interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (loginData: LoginFormData) => {
    console.log('Login data:', loginData);
    setIsLoggedIn(true);
  };

  return (
    <DashboardPage />
  );
}

export default App;
