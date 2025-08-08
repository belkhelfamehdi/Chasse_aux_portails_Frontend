import React, { useState, useEffect } from 'react';
import { citiesAPI } from '../../services/api';
import Button from '../Button';
import AddCityModal from '../modals/AddCityModal';
import Loading from '../Loading';

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

interface CityFormData {
  nom: string;
  latitude: number;
  longitude: number;
  rayon: number;
  adminId?: number;
}

const CitiesContent: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load cities on component mount
  useEffect(() => {
    loadCities();
  }, []);

    const loadCities = async () => {
    try {
      setIsLoading(true);
      const response = await citiesAPI.getAll();
      setCities(response as City[]);
    } catch (error) {
      console.error('Error loading cities:', error);
      // Initialize empty array on error - user will see "no cities found" message
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCity = async (cityData: CityFormData) => {
    try {
      setIsSubmitting(true);
      await citiesAPI.create(cityData);
      await loadCities(); // Reload the list to get fresh data
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding city:', error);
      // Show error message to user instead of fallback data
      alert('Erreur lors de l\'ajout de la ville. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCity = async (cityId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) {
      try {
        setIsDeleting(cityId);
        await citiesAPI.delete(cityId);
        await loadCities(); // Reload the list to get fresh data
      } catch (error) {
        console.error('Error deleting city:', error);
        alert('Erreur lors de la suppression de la ville. Veuillez réessayer.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const formatCoordinates = (latitude: number, longitude: number) => {
    return `${latitude.toFixed(4)}° N, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading size="lg" message="Loading cities..." className="min-h-96" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Cities</h1>
        </div>
        <Button
          label="Créer une ville"
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Cities Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
        <table className="min-w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Coordinates
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Radius
              </th>
              <th className="px-6 py-3 text-sm font-medium text-right text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cities.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  Aucune ville trouvée.
                </td>
              </tr>
            ) : (
              cities.map((city) => (
                <tr key={city.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {city.nom}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary">
                    {formatCoordinates(city.latitude, city.longitude)}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary">
                    {city.rayon} km
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        title="Modifier"
                        className="text-blue-600 transition-colors hover:text-blue-800"
                      >
                        <span className="text-sm">Edit</span>
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        title="Supprimer"
                        onClick={() => handleDeleteCity(city.id)}
                        disabled={isDeleting === city.id}
                        className="text-red-600 transition-colors hover:text-red-800 disabled:opacity-50"
                      >
                        {isDeleting === city.id ? (
                          <Loading size="sm" />
                        ) : (
                          <span className="text-sm">Delete</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add City Modal */}
      <AddCityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCity}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CitiesContent;
