import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AddPOIModal from '../modals/AddPOIModal';
import Button from '../Button';

interface POI {
  id: number;
  nom: string;
  description: string;
  latitude: number;
  longitude: number;
  iconUrl: string;
  modelUrl: string;
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
  iconUrl: string;
  modelUrl: string;
  cityId: number;
}

const mockPOIs: POI[] = [
  {
    id: 1,
    nom: 'Grand Plaza Fountain',
    description: 'A beautiful fountain in the heart of Grand Plaza.',
    latitude: 40.7812,
    longitude: -73.9665,
    iconUrl: 'https://example.com/fountain-icon.png',
    modelUrl: 'https://example.com/fountain-model.glb',
    cityId: 1,
    city: { id: 1, nom: 'New York' }
  },
  {
    id: 2,
    nom: 'Apex Tower',
    description: 'Iconic skyscraper with observation decks.',
    latitude: 40.7484,
    longitude: -73.9857,
    iconUrl: 'https://example.com/tower-icon.png',
    modelUrl: 'https://example.com/tower-model.glb',
    cityId: 1,
    city: { id: 1, nom: 'New York' }
  },
  {
    id: 3,
    nom: 'Bright Square',
    description: 'Vibrant commercial and entertainment hub.',
    latitude: 40.7589,
    longitude: -73.9851,
    iconUrl: 'https://example.com/square-icon.png',
    modelUrl: 'https://example.com/square-model.glb',
    cityId: 1,
    city: { id: 1, nom: 'New York' }
  },
  {
    id: 4,
    nom: 'National Museum of Art',
    description: 'One of the world\'s largest and finest art museums.',
    latitude: 40.7794,
    longitude: -73.9632,
    iconUrl: 'https://example.com/museum-icon.png',
    modelUrl: 'https://example.com/museum-model.glb',
    cityId: 1,
    city: { id: 1, nom: 'New York' }
  },
  {
    id: 5,
    nom: 'Liberty Bridge',
    description: 'Historic suspension bridge connecting Manhattan and Brooklyn.',
    latitude: 40.7061,
    longitude: -73.9969,
    iconUrl: 'https://example.com/bridge-icon.png',
    modelUrl: 'https://example.com/bridge-model.glb',
    cityId: 1,
    city: { id: 1, nom: 'New York' }
  }
];

export default function POIsContent() {
  const [pois, setPois] = useState<POI[]>(mockPOIs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddPOI = (poiData: POIFormData) => {
    const newPOI: POI = {
      id: Math.max(...pois.map(p => p.id)) + 1,
      ...poiData,
      city: mockPOIs.find(p => p.cityId === poiData.cityId)?.city
    };
    setPois([...pois, newPOI]);
    setIsAddModalOpen(false);
  };

  const handleDeletePOI = (poiId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce POI ?')) {
      setPois(pois.filter(poi => poi.id !== poiId));
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

  const getIconDisplay = (iconUrl: string) => {
    // Simple icon mapping for demo
    const iconMap: { [key: string]: string } = {
      'fountain': '🏛️',
      'tower': '🏢',
      'square': '📍',
      'museum': '🏛️',
      'bridge': '🌉'
    };

    const iconType = Object.keys(iconMap).find(type => iconUrl.includes(type));
    return iconType ? iconMap[iconType] : '📍';
  };

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
                        className="text-red-600 transition-colors hover:text-red-800"
                      >
                        <span className="text-sm">Delete</span>
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
      />
    </div>
  );
}
