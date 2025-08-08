import React, { useState, useEffect } from 'react';
import { MapPinIcon, UsersIcon, MapIcon } from '@heroicons/react/24/outline';
import { citiesAPI, poisAPI, adminsAPI } from '../../services/api';

interface Stats {
  totalCities: number;
  totalPOIs: number;
  totalAdmins: number;
}

const DashboardContent: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalCities: 0,
    totalPOIs: 0,
    totalAdmins: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load all data in parallel
      const [citiesResponse, poisResponse, adminsResponse] = await Promise.allSettled([
        citiesAPI.getAll(),
        poisAPI.getAll(),
        adminsAPI.getAll()
      ]);

      const newStats: Stats = {
        totalCities: citiesResponse.status === 'fulfilled' ? (citiesResponse.value as unknown[]).length : 0,
        totalPOIs: poisResponse.status === 'fulfilled' ? (poisResponse.value as unknown[]).length : 0,
        totalAdmins: adminsResponse.status === 'fulfilled' ? (adminsResponse.value as unknown[]).length : 0,
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Keep default zero values on error
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                <MapIcon className="h-auto w-7 text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cities</p>
              <p className="text-xl font-semibold text-gray-900">
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ...
                  </span>
                ) : stats.totalCities}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                <MapPinIcon className="h-auto w-7 text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total POIs</p>
              <p className="text-xl font-semibold text-gray-900">
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ...
                  </span>
                ) : stats.totalPOIs.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                <UsersIcon className="h-auto w-7 text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Admins</p>
              <p className="text-xl font-semibold text-gray-900">
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ...
                  </span>
                ) : stats.totalAdmins}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Activités récentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  Les activités récentes s'afficheront ici une fois que les utilisateurs commenceront à interagir avec le système.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Admins */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Active Admins</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  La liste des administrateurs actifs s'affichera ici une fois que les données seront disponibles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
