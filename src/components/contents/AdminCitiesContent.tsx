import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { citiesAPI, type CityData } from '../../services/api';
import { useNotifications } from '../../contexts/useNotifications';
import { useAuth } from '../../contexts/useAuth';
import Button from '../Button';
import { CitiesEmptyState, ErrorEmptyState } from '../EmptyStates';
import { TableSkeleton } from '../Loading';
import EditCityModal from '../modals/EditCityModal';

interface POI {
  id: number;
  nom: string;
}

interface City {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
  rayon: number;
  adminId?: number;
  admin?: {
    id: number;
    firstname: string;
    lastname: string;
  };
  pois?: POI[];
}

type CityFormData = CityData;

const AdminCitiesContent: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useNotifications();
  const { user } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCities = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await citiesAPI.getAdminCities();
      setCities(data as City[]);
    } catch (err) {
      console.error('Error loading cities:', err);
      setHasError(true);
      error('Erreur lors du chargement des villes');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (user?.id) {
      loadCities();
    }
  }, [user?.id, loadCities]);

  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCity(null);
  };

  const handleUpdateCity = async (cityData: Partial<CityFormData>) => {
    if (!editingCity || !cityData.nom) return;
    
    try {
      setIsSubmitting(true);
      const updatedCity = await citiesAPI.updateAsAdmin(editingCity.id, cityData as CityFormData);
      setCities(prev => prev.map(city => 
        city.id === editingCity.id ? { ...city, ...updatedCity as City } : city
      ));
      success('Ville mise à jour avec succès');
      handleCloseEditModal();
    } catch (err) {
      console.error('Error updating city:', err);
      error('Erreur lors de la mise à jour de la ville');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCityDetails = (cityId: number) => {
    navigate(`/cities/${cityId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <ErrorEmptyState
        onRetry={loadCities}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Villes</h2>
          <p className="text-gray-600">Gérez les villes qui vous sont assignées</p>
        </div>
      </div>

      {/* Content */}
      {cities.length === 0 ? (
        <CitiesEmptyState />
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ville
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordonnées
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rayon (km)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points d'Intérêt
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{city.nom}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {city.latitude.toFixed(6)}, {city.longitude.toFixed(6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {city.rayon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {city.pois?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        label="Voir Détails"
                        className="bg-gray-500 hover:bg-gray-600 text-xs py-1 px-2"
                        onClick={() => handleViewCityDetails(city.id)}
                      />
                      <Button
                        label="Modifier"
                        className="bg-blue-500 hover:bg-blue-600 text-xs py-1 px-2"
                        onClick={() => handleEditCity(city)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingCity && (
        <EditCityModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialCity={editingCity}
          onSubmit={handleUpdateCity}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default AdminCitiesContent;
