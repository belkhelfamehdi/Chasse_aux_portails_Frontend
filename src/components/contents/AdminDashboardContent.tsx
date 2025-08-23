import React, { useState, useEffect, useCallback } from 'react';
import { MapPinIcon, MapIcon } from '@heroicons/react/24/outline';
import { citiesAPI, poisAPI } from '../../services/api';
import { useAuth } from '../../contexts/useAuth';

interface Stats {
  myCities: number;
  myPOIs: number;
}

interface City {
  id: string;
  nom: string;
  latitude: number;
  longitude: number;
  rayon: number;
  adminId?: number;
  pois?: Array<{ id: number; nom: string; }>;
}

interface POI {
  id: number;
  nom: string;
  description: string;
  latitude: number;
  longitude: number;
  iconUrl?: string;
  modelUrl?: string;
  cityId: number;
  city?: {
    id: number;
    nom: string;
  };
}

interface Activity {
  id: string;
  type: 'poi_created' | 'poi_updated' | 'city_updated';
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

const AdminDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    myCities: 0,
    myPOIs: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [myCities, setMyCities] = useState<City[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  const generateActivitiesForCities = useCallback((cities: City[]) => {
    try {
      setIsLoadingActivities(true);
      
      // Générer des activités récentes pour cet admin spécifiquement
      const activities: Activity[] = [];
      
      // Activités simulées basées sur les villes de l'admin
      if (cities.length > 0) {
        cities.slice(0, 3).forEach((city, index) => {
          activities.push({
            id: `city-update-${city.id}-${index}`,
            type: 'city_updated',
            description: `Ville "${city.nom}" mise à jour`,
            timestamp: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000).toISOString(),
            icon: <MapIcon className="w-5 h-5 text-blue-500" />
          });
        });
      }
      
      // Activités POI simulées
      for (let i = 0; i < 2; i++) {
        activities.push({
          id: `poi-activity-${i}`,
          type: 'poi_created',
          description: `Nouveau point d'intérêt ajouté`,
          timestamp: new Date(Date.now() - (i + 1) * 1.5 * 60 * 60 * 1000).toISOString(),
          icon: <MapPinIcon className="w-5 h-5 text-green-500" />
        });
      }
      
      // Trier par timestamp décroissant
      const sortedActivities = [...activities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);
      
      setRecentActivities(sortedActivities);
    } catch (error) {
      console.error('Error generating activities:', error);
      setRecentActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  const loadAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Charger les villes de l'admin directement
      const citiesResponse = await citiesAPI.getAdminCities();
      const adminCities = citiesResponse as City[];
      setMyCities(adminCities);
      
      // Charger les POIs de l'admin directement
      const poisResponse = await poisAPI.getAdminPOIs();
      const adminPOIs = poisResponse as POI[];
      
      setStats({
        myCities: adminCities.length,
        myPOIs: adminPOIs.length
      });

      // Générer les activités directement ici avec les données fraîches
      generateActivitiesForCities(adminCities);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [generateActivitiesForCities]);

  useEffect(() => {
    loadAdminData();
  }, [user?.id, loadAdminData]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours === 1) return 'Il y a 1 heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heures`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Il y a 1 jour';
    return `Il y a ${diffInDays} jours`;
  };

  return (
    <div className="space-y-6">
      {/* Header avec informations de l'admin */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Bonjour, {user?.firstname} {user?.lastname}
        </h2>
        <p className="text-blue-100">
          Tableau de bord administrateur - Gérez vos villes et points d'intérêt
        </p>
      </div>

      {/* Statistiques de l'admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Mes Villes</p>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.myCities}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPinIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Mes Points d'Intérêt</p>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.myPOIs}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mes Villes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mes Villes</h3>
          {isLoading ? (
            <div className="space-y-3">
              <div className="animate-pulse flex space-x-3">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="animate-pulse flex space-x-3">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="animate-pulse flex space-x-3">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {myCities.length > 0 ? (
                <div className="space-y-3">
                  {myCities.slice(0, 5).map((city) => (
                    <div key={city.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <MapIcon className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{city.nom}</p>
                        <p className="text-xs text-gray-500">
                          {city.pois?.length || 0} point(s) d'intérêt
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune ville assignée</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Vous n'avez aucune ville à gérer pour le moment.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Activités Récentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activités Récentes</h3>
          {isLoadingActivities ? (
            <div className="space-y-3">
              <div className="animate-pulse flex space-x-3">
                <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="animate-pulse flex space-x-3">
                <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="animate-pulse flex space-x-3">
                <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité récente</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Vos activités récentes apparaîtront ici.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
