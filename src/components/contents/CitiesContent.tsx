import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { citiesAPI, type CityData } from '../../services/api';
import { useNotifications } from '../../contexts/useNotifications';
import Button from '../Button';
import { CitiesEmptyState, ErrorEmptyState } from '../EmptyStates';
import Loading, { TableSkeleton } from '../Loading';
import AddCityModal from '../modals/AddCityModal';
import EditCityModal from '../modals/EditCityModal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

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

const CitiesContent: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useNotifications();
  const [cities, setCities] = useState<City[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);
  const [hasError, setHasError] = useState(false);

  // Load cities on component mount
  useEffect(() => {
    loadCities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCities = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await citiesAPI.getAll();
      setCities(response as City[]);
    } catch (err) {
      console.error('Error loading cities:', err);
      setHasError(true);
      setCities([]);
      error('Erreur de chargement', 'Impossible de charger la liste des villes');
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
      success('Ville ajoutée', `La ville "${cityData.nom}" a été créée avec succès`);
    } catch (err) {
      console.error('Error adding city:', err);
      error('Erreur lors de l\'ajout', 'Impossible d\'ajouter la ville. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCity = async (city: City) => {
    setCityToDelete(city);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCity = async () => {
    if (!cityToDelete) return;

    try {
      setIsDeleting(cityToDelete.id);
      await citiesAPI.delete(cityToDelete.id);
      await loadCities(); // Reload the list to get fresh data
      
      // Close modal and reset
      setIsDeleteModalOpen(false);
      setCityToDelete(null);
      success('Ville supprimée', `La ville "${cityToDelete.nom}" a été supprimée avec succès`);
    } catch (err) {
      console.error('Error deleting city:', err);
      error('Erreur lors de la suppression', 'Impossible de supprimer la ville. Veuillez réessayer.');
    } finally {
      setIsDeleting(null);
    }
  };

  const cancelDeleteCity = () => {
    setIsDeleteModalOpen(false);
    setCityToDelete(null);
  };

  const openEdit = (city: City) => {
    setEditingCity(city);
    setIsEditModalOpen(true);
  };

  const handleEditCity = async (data: Partial<CityData>) => {
    if (!editingCity) return;
    try {
      setIsSubmitting(true);
      await citiesAPI.update(editingCity.id, data);
      await loadCities();
      setIsEditModalOpen(false);
      setEditingCity(null);
      success('Ville modifiée', `La ville "${editingCity.nom}" a été mise à jour avec succès`);
    } catch (err) {
      console.error('Error updating city:', err);
      error('Erreur lors de la modification', 'Impossible de modifier la ville. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCoordinates = (latitude: number, longitude: number) => {
    return `${latitude.toFixed(4)}° N, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`;
  };

  const getSubtitleText = () => {
    if (cities.length === 0) return 'Aucune ville configurée';
    const villeText = cities.length > 1 ? 'villes' : 'ville';
    const trouveeText = cities.length > 1 ? 'trouvées' : 'trouvée';
    return `${cities.length} ${villeText} ${trouveeText}`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des villes</h1>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des villes</h1>
          </div>
          <Button
            label="Créer une ville"
            onClick={() => setIsAddModalOpen(true)}
          />
        </div>
        <ErrorEmptyState onRetry={loadCities} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des villes</h1>
          <p className="text-gray-600 mt-1">
            {getSubtitleText()}
          </p>
        </div>
        <Button
          label="Créer une ville"
          onClick={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Cities Content */}
      {cities.length === 0 ? (
        <CitiesEmptyState onAction={() => setIsAddModalOpen(true)} />
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                  Nom
                </th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                  Coordonnées
                </th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                  Rayon
                </th>
                <th className="px-6 py-3 text-sm font-medium text-right text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cities.map((city) => (
                <tr key={city.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <button
                      onClick={() => navigate(`/cities/${city.id}`)}
                      className="text-primary hover:text-primary-light underline font-medium cursor-pointer transition-colors duration-150"
                      title={`Voir les détails de ${city.nom}`}
                    >
                      {city.nom}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatCoordinates(city.latitude, city.longitude)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {city.rayon} km
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        title="Modifier"
                        onClick={() => openEdit(city)}
                        className="text-primary hover:text-primary-light font-semibold transition-colors duration-150 cursor-pointer"
                      >
                        <span className="text-sm">Modifier</span>
                      </button>
                      <span className="text-gray-300 font-semibold">|</span>
                      <button
                        title="Supprimer"
                        onClick={() => handleDeleteCity(city)}
                        disabled={isDeleting === city.id}
                        className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting === city.id ? (
                          <Loading size="sm" />
                        ) : (
                          <span className="text-sm">Supprimer</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add City Modal */}
      <AddCityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCity}
        isLoading={isSubmitting}
      />

      {/* Edit City Modal */}
      <EditCityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialCity={editingCity}
        onSubmit={handleEditCity}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteCity}
        onConfirm={confirmDeleteCity}
        title="Supprimer la ville"
        message="Êtes-vous sûr de vouloir supprimer cette ville ?"
        itemName={cityToDelete?.nom}
        isDeleting={isDeleting === cityToDelete?.id}
      />
    </div>
  );
};

export default CitiesContent;
