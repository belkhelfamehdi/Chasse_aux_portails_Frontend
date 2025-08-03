import React, { type ReactNode } from 'react';
import { HomeIcon, MapIcon, MapPinIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import Logo from '../assets/logo.png';

interface LayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle = "Welcome back" }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="flex flex-col w-64 bg-white shadow-lg">
                <div className="self-center p-6">
                    <img src={Logo} alt="Logo" className="w-24 h-auto" />
                </div>

                <nav className="px-6 pb-6">
                    <ul className="space-y-2">
                        <li>
                            <button className="flex items-center w-full px-4 py-3 space-x-3 rounded-lg text-primary bg-primary/10">
                                <HomeIcon className="w-5 h-auto" />
                                <span>Dashboard</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex items-center w-full px-4 py-3 space-x-3 text-left text-gray-600 rounded-lg hover:text-primary hover:bg-gray-50">
                                <MapIcon className="w-5 h-auto" />
                                <span>Cities</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex items-center w-full px-4 py-3 space-x-3 text-left text-gray-600 rounded-lg hover:text-primary hover:bg-gray-50">
                                <MapPinIcon className="w-5 h-auto" />
                                <span>POIs</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex items-center w-full px-4 py-3 space-x-3 text-left text-gray-600 rounded-lg hover:text-primary hover:bg-gray-50">
                                <UsersIcon className="w-5 h-auto" />
                                <span>Admins</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex items-center w-full px-4 py-3 space-x-3 text-left text-gray-600 rounded-lg hover:text-primary hover:bg-gray-50">
                                <Cog6ToothIcon className="w-5 h-auto" />
                                <span>Settings</span>
                            </button>
                        </li>
                    </ul>
                </nav>
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
