import React, { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, MapIcon, MapPinIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import Logo from '../assets/logo.png';

interface LayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
    onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle = "Welcome back", onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navigationItems = [
        { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
        { path: '/cities', icon: MapIcon, label: 'Villes' },
        { path: '/pois', icon: MapPinIcon, label: 'POIs' },
        { path: '/admins', icon: UsersIcon, label: 'Admins' },
        { path: '/settings', icon: Cog6ToothIcon, label: 'Paramètres' },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="flex flex-col w-64 bg-white shadow-lg">
                <div className="self-center p-6">
                    <img src={Logo} alt="Logo" className="w-24 h-auto" />
                </div>

                <nav className="px-6 pb-6 flex-1">
                    <ul className="space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            
                            return (
                                <li key={item.path}>
                                    <button 
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center w-full px-4 py-3 space-x-3 rounded-lg transition-colors ${
                                            isActive 
                                                ? 'text-primary bg-primary/10' 
                                                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon className="w-5 h-auto" />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="px-6 pb-6">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 space-x-3 text-left text-gray-600 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <ArrowRightStartOnRectangleIcon className="w-5 h-auto" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                {/* Header */}
                <header className="px-6 py-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                            <p className="text-sm font-light text-primary">{subtitle}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center mr-5 space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800">John Doe</p>
                                    <p className="text-xs text-primary">Admin</p>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
