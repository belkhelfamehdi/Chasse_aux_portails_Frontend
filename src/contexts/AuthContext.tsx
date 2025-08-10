import React, { createContext, useState, useEffect, useMemo } from 'react';
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

const AuthContext = createContext<AuthContextType | null>(null);

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
        const savedToken = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user') ?? sessionStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string, rememberMe?: boolean): Promise<void> => {
        setIsLoginLoading(true);
        try {
            const response = await authAPI.login(email, password);
            
            setUser(response.user);
            setToken(response.accessToken);

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('accessToken', response.accessToken);
            storage.setItem('user', JSON.stringify(response.user));
        } finally {
            setIsLoginLoading(false);
        }
    };

    // Keep token/user in sync if a background refresh happens via api.ts helper
    useEffect(() => {
        // Listen to cross-tab storage changes
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'accessToken') {
                setToken(e.newValue);
            }
            if (e.key === 'user' && e.newValue) {
                try {
                    setUser(JSON.parse(e.newValue));
                } catch {
                    // Ignore parse errors
                }
            }
        };
        // Listen to in-app auth update events fired by api.ts after refresh
        const onAuthUpdated = (e: Event) => {
            const custom = e as CustomEvent<{ accessToken?: string; user?: User }>;
            if (custom.detail?.accessToken) setToken(custom.detail.accessToken);
            if (custom.detail?.user) setUser(custom.detail.user);
        };
        window.addEventListener('storage', onStorage);
        window.addEventListener('auth:updated', onAuthUpdated as EventListener);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('auth:updated', onAuthUpdated as EventListener);
        };
    }, []);

    const logout = async (): Promise<void> => {
        setIsLogoutLoading(true);
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('user');
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

export { AuthContext };

