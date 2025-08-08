import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { authAPI, type User } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    isLoginLoading: boolean;
    isLogoutLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    const isAuthenticated = !!user && !!token;

    // Load saved authentication data on startup
    useEffect(() => {
        const savedToken = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoginLoading(true);
        try {
            const response = await authAPI.login(email, password);
            
            setUser(response.user);
            setToken(response.accessToken);

            // Always save to localStorage for now
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response.user));
        } finally {
            setIsLoginLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            setIsLogoutLoading(true);
            // Try to call logout endpoint to clear cookies
            try {
                await authAPI.logout();
            } catch {
                // Ignore logout API errors - just clear local state
                console.warn('Logout API call failed, clearing local state anyway');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local state regardless of API call success
            setUser(null);
            setToken(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setIsLogoutLoading(false);
        }
    };

    const value = useMemo(() => ({
        user,
        token,
        login,
        logout,
        isLoading,
        isLoginLoading,
        isLogoutLoading,
        isAuthenticated,
    }), [user, token, isLoading, isLoginLoading, isLogoutLoading, isAuthenticated]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
