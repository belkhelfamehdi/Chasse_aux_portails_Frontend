import { useState } from 'react';
import LoginPage from './pages/LoginPage';

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
    <LoginPage onLogin={handleLogin} />
  );
}

export default App;
