import React, { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, MapIcon, MapPinIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/logo.png';

interface LayoutProps {
    children: ReactNode;
    title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const navigationItems = [
        { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
        { path: '/cities', icon: MapIcon, label: 'Villes' },
        { path: '/pois', icon: MapPinIcon, label: 'POIs' },
        { path: '/admins', icon: UsersIcon, label: 'Admins', requiresSuperAdmin: true },
        { path: '/settings', icon: Cog6ToothIcon, label: 'Paramètres' },
    ];

    // Generate breadcrumb based on current path
    const generateBreadcrumb = () => {
        const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
        
        // Handle root/dashboard case
        if (pathSegments.length === 0 || pathSegments[0] === 'dashboard') {
            return 'Dashboard';
        }
        
        const breadcrumbItems = ['Dashboard'];
        
        for (const segment of pathSegments) {
            const navItem = navigationItems.find(item => item.path === `/${segment}`);
            if (navItem && navItem.label !== 'Dashboard') {
                breadcrumbItems.push(navItem.label);
            }
        }
        
        return breadcrumbItems.join(' > ');
    };

    // Filter navigation items based on user role
    const filteredNavigationItems = navigationItems.filter(item => {
        if (item.requiresSuperAdmin && user?.role !== 'SUPER_ADMIN') {
            return false;
        }
        return true;
    });

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getUserDisplayName = () => {
        if (user?.firstname && user?.lastname) {
            return `${user.firstname} ${user.lastname}`;
        }
        return user?.email || 'Utilisateur';
    };

    const getRoleDisplayName = () => {
        switch (user?.role) {
            case 'SUPER_ADMIN':
                return 'Super Admin';
            case 'ADMIN':
                return 'Admin';
            default:
                return 'Utilisateur';
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="flex flex-col justify-between w-16 transition-all duration-300 ease-in-out bg-white shadow-lg group hover:w-64">
                <div className="flex items-center self-center justify-center pt-6">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="w-8 h-auto transition-all duration-300 ease-in-out group-hover:w-24"
                    />
                </div>

                <nav className="px-3 pb-6 transition-all duration-300 ease-in-out group-hover:px-6">
                    <ul className="space-y-4">
                        {filteredNavigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <li key={item.path}>
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center w-full px-3 group-hover:px-4 py-3 space-x-0 group-hover:space-x-3 rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${isActive
                                                ? 'text-primary bg-primary/10'
                                                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                            }`}
                                        title={item.label}
                                    >
                                        <Icon className="flex-shrink-0 w-5 h-auto" />
                                        <span className="overflow-hidden transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                            {item.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="px-3 pb-6 transition-all duration-300 ease-in-out group-hover:px-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-3 space-x-0 text-left text-gray-600 transition-all duration-300 ease-in-out rounded-lg group-hover:px-4 group-hover:space-x-3 hover:text-red-600 hover:bg-red-50"
                        title="Déconnexion" // Tooltip for collapsed state
                    >
                        <ArrowRightStartOnRectangleIcon className="flex-shrink-0 w-5 h-auto" />
                        <span className="overflow-hidden transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
                            Déconnexion
                        </span>
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
                            <p className="text-sm font-light text-primary">{generateBreadcrumb()}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center mr-5 space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800">{getUserDisplayName()}</p>
                                    <p className="text-xs text-primary">{getRoleDisplayName()}</p>
                                </div>
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                                    <span className="text-sm font-medium text-gray-600">
                                        {user?.firstname?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
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
