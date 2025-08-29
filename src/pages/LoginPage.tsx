import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useNotifications } from '../contexts/useNotifications';
import { LoadingSpinner } from '../components/Loading';
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal';
import Logo from '../assets/logo.png';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { success, error: showError } = useNotifications();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState<string | null>(null);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fonction de debug pour nettoyer le stockage
    const clearAllStorage = () => {
        localStorage.clear();
        sessionStorage.clear();
        success('Stockage nettoyé', 'Vous pouvez maintenant vous reconnecter');
        window.location.reload();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setIsSubmitting(true);
            await login(formData.email, formData.password, formData.rememberMe);
            success('Connexion réussie', 'Bienvenue dans votre tableau de bord !');
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
            setError(errorMessage);
            showError('Erreur de connexion', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
                    <h1 className="font-special-title text-4xl text-ynov-secondary mb-2">
                        Chasse aux portails
                    </h1>
                    <p className="font-text text-ynov-primary opacity-75">
                        Connectez-vous à votre espace
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-10">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg animate-pulse">
                            {error}
                        </div>
                    )}

                    <div>
                        {/* Email Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-ynov-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                placeholder="Adresse e-mail"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="font-text w-full py-3 pl-10 pr-3 text-sm text-ynov-primary placeholder-gray-400 transition-all duration-200 border border-gray-300 rounded-t-lg bg-gray-50 focus:outline-none focus:border-ynov-secondary focus:bg-white focus:ring-2 focus:ring-ynov-secondary focus:ring-opacity-20"
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-ynov-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="font-text w-full py-3 pl-10 pr-3 text-sm text-ynov-primary placeholder-gray-400 transition-all duration-200 border border-gray-300 rounded-b-lg bg-gray-50 focus:outline-none focus:border-ynov-secondary focus:bg-white focus:ring-2 focus:ring-ynov-secondary focus:ring-opacity-20"
                                disabled={isSubmitting}
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
                                className="w-4 h-4 text-ynov-secondary border-gray-300 rounded focus:ring-ynov-secondary"
                                disabled={isSubmitting}
                            />
                            <span className="ml-2 font-text text-ynov-primary">Se souvenir de moi</span>
                        </label>
                        <button
                            type="button"
                            className="font-text font-medium text-ynov-secondary cursor-pointer hover:text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setIsForgotPasswordOpen(true)}
                            disabled={isSubmitting}
                        >
                            Mot de passe oublié ?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-lg font-montserrat font-medium transition-all duration-200 flex items-center justify-center ${
                            isFormValid && !isSubmitting
                                ? 'bg-ynov-secondary hover:bg-ynov-secondary/80 text-white cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isFormValid || isSubmitting}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            {isSubmitting && <LoadingSpinner size="sm" className="text-white" />}
                            <span>{isSubmitting ? 'Connexion...' : 'Se connecter'}</span>
                        </div>
                    </button>
                </form>
            </div>

            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
            />
        </div>
    );
};

export default LoginPage;