import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { poisAPI } from '../../services/api';
import AddPOIModal from '../modals/AddPOIModal';
import Button from '../Button';
import Loading from '../Loading';

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

interface POIFormData {
  nom: string;
  description: string;
  latitude: number;
  longitude: number;
  iconUrl?: string;
  modelUrl?: string;
  iconFile?: File | null;
  modelFile?: File | null;
  cityId: number;
}

export default function POIsContent() {
  const [pois, setPois] = useState<POI[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load POIs on component mount
  useEffect(() => {
    loadPOIs();
  }, []);

  const loadPOIs = async () => {
    try {
      setIsLoading(true);
      const response = await poisAPI.getAll();
      setPois(response as POI[]);
    } catch (error) {
      console.error('Error loading POIs:', error);
      // Initialize empty array on error - user will see "no POIs found" message
      setPois([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPOI = async (poiData: POIFormData) => {
    try {
      setIsSubmitting(true);
      await poisAPI.create(poiData);
      await loadPOIs(); // Reload the list to get fresh data
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding POI:', error);
      // Show error message to user instead of fallback data
      alert('Erreur lors de l\'ajout du POI. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePOI = async (poiId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce POI ?')) {
      try {
        setIsDeleting(poiId);
        await poisAPI.delete(poiId);
        await loadPOIs(); // Reload the list to get fresh data
      } catch (error) {
        console.error('Error deleting POI:', error);
        alert('Erreur lors de la suppression du POI. Veuillez réessayer.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const filteredPOIs = pois.filter(poi => {
    const matchesSearch = poi.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCoordinates = (latitude: number, longitude: number) => {
    return `${latitude.toFixed(4)}° N, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`;
  };

  const getIconDisplay = (iconUrl?: string) => {
    if (!iconUrl) return '📍'; // Default icon if no URL provided
    
    // Simple icon mapping for demo - matching the UI design icons
    const iconMap: { [key: string]: string } = {
      'fountain-icon.png': '⛲',
      'tower-icon.png': '🏢',
      'park-icon.png': '🌳',
      'museum-icon.png': '🏛️',
      'bridge-icon.png': '🌉'
    };

    const fileName = iconUrl.split('/').pop() || '';
    return iconMap[fileName] || '📍';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading size="lg" message="Loading points of interest..." className="min-h-96" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Points of Interest</h1>
          <p className="text-sm text-primary">Manage points of interest for the selected city.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className='w-full'>
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Search points of interest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
            />
          </div>
        </div>
        <Button
          label="Ajouter un POI"
          onClick={() => setIsAddModalOpen(true)}
          className='min-w-fit'
        />
      </div>

      {/* POI Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
        <table className="min-w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Description
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Coordinates
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Icon/Model
              </th>
              <th className="px-6 py-3 text-sm font-medium text-right text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPOIs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Aucun POI trouvé.
                </td>
              </tr>
            ) : (
              filteredPOIs.map((poi) => (
                <tr key={poi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {poi.nom}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary">
                    {poi.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary">
                    {formatCoordinates(poi.latitude, poi.longitude)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getIconDisplay(poi.iconUrl)}</span>
                      {poi.modelUrl && (
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 border rounded">
                          <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        </div>
                      )}
                    </div>
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
                        onClick={() => handleDeletePOI(poi.id)}
                        disabled={isDeleting === poi.id}
                        className="text-red-600 transition-colors hover:text-red-800 disabled:opacity-50"
                      >
                        {isDeleting === poi.id ? (
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

      {/* Add POI Modal */}
      <AddPOIModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPOI}
        isLoading={isSubmitting}
      />
    </div>
  );
}
