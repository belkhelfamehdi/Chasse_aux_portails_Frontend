import React, { useState } from 'react';
import Button from '../components/Button';
import Logo from '../assets/logo.png';

interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface LoginPageProps {
    onLogin?: (data: LoginFormData) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onLogin) {
            onLogin(formData);
        } else {
            console.log('Login attempted with:', formData);
        }
    };

    const isFormValid = formData.email && formData.password;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col justify-center w-full max-w-md px-8 py-8 pb-16 bg-white shadow-lg rounded-2xl">
                {/* Logo and Title */}
                <div className="flex flex-col items-center justify-center mx-auto mb-8 text-center">
                    <div className="mb-4">
                        <img src={Logo} alt="Logo" className="h-auto w-60" />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Chasse aux portails
                    </h1>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-10">

                    <div>
                        {/* Email Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                placeholder="Adresse e-mail"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full py-3 pl-10 pr-3 text-sm text-gray-700 placeholder-gray-400 transition-colors border border-gray-300 rounded-t-lg bg-gray-50 focus:outline-none focus:border-teal-500 focus:bg-white"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full py-3 pl-10 pr-3 text-sm text-gray-700 placeholder-gray-400 transition-colors border border-gray-300 rounded-b-lg bg-gray-50 focus:outline-none focus:border-teal-500 focus:bg-white"
                                required
                            />
                        </div>
                    </div>
                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="ml-2 text-gray-600">Se souvenir de moi</span>
                        </label>
                        <button
                            type="button"
                            className="font-medium text-teal-600 cursor-pointer hover:text-teal-800"
                            onClick={() => alert('Fonctionnalité à implémenter')}
                        >
                            Mot de passe oublié ?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <Button
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isFormValid
                                ? 'bg-teal-500 hover:bg-teal-600 text-white cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        label="Se connecter"
                        onClick={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)} />
                </form>
            </div>
        </div>
    );
};

export default LoginPage;