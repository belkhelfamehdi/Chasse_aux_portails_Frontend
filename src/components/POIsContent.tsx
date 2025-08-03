import { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import AddPOIModal from './AddPOIModal';

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

const mockPOIs: POI[] = [
  {
    id: 1,
    nom: 'Tour Eiffel',
    description: 'Tour emblématique en fer forgé et symbole de la France',
    latitude: 48.8584,
    longitude: 2.2945,
    iconUrl: 'https://example.com/icon1.png',
    modelUrl: 'https://example.com/model1.glb',
    cityId: 1,
    city: { id: 1, nom: 'Paris' }
  },
  {
    id: 2,
    nom: 'Arc de Triomphe',
    description: 'Monument historique situé sur la place Charles-de-Gaulle',
    latitude: 48.8738,
    longitude: 2.2950,
    iconUrl: 'https://example.com/icon2.png',
    modelUrl: 'https://example.com/model2.glb',
    cityId: 1,
    city: { id: 1, nom: 'Paris' }
  },
  {
    id: 3,
    nom: 'Statue de la Liberté',
    description: 'Monument emblématique de New York',
    latitude: 40.6892,
    longitude: -74.0445,
    iconUrl: 'https://example.com/icon3.png',
    modelUrl: 'https://example.com/model3.glb',
    cityId: 2,
    city: { id: 2, nom: 'New York' }
  },
  {
    id: 4,
    nom: 'Empire State Building',
    description: 'Gratte-ciel Art déco emblématique de Manhattan',
    latitude: 40.7484,
    longitude: -73.9857,
    iconUrl: 'https://example.com/icon4.png',
    modelUrl: 'https://example.com/model4.glb',
    cityId: 2,
    city: { id: 2, nom: 'New York' }
  },
  {
    id: 5,
    nom: 'Temple Senso-ji',
    description: 'Temple bouddhiste ancien à Asakusa, Tokyo',
    latitude: 35.7148,
    longitude: 139.7967,
    iconUrl: 'https://example.com/icon5.png',
    modelUrl: 'https://example.com/model5.glb',
    cityId: 3,
    city: { id: 3, nom: 'Tokyo' }
  }
];

interface POIFormData {
  nom: string;
  description: string;
  latitude: number;
  longitude: number;
  iconUrl: string;
  modelUrl: string;
  cityId: number;
}

export default function POIsContent() {
  const [pois, setPois] = useState<POI[]>(mockPOIs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');

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
                         poi.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (poi.city?.nom.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesCity = cityFilter === 'all' || poi.city?.nom === cityFilter;
    return matchesSearch && matchesCity;
  });

  const uniqueCities = Array.from(new Set(pois.map(poi => poi.city?.nom).filter(Boolean)));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Points d'Intérêt</h1>
          <p className="text-gray-600">Gérez les POIs de votre plateforme de chasse aux portails</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nouveau POI</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total POIs</p>
              <p className="text-2xl font-bold text-gray-900">{pois.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Villes</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueCities.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Coordonnées</p>
              <p className="text-2xl font-bold text-gray-900">{pois.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Modèles 3D</p>
              <p className="text-2xl font-bold text-gray-900">{pois.filter(p => p.modelUrl).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, description ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Toutes les villes</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* POI Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                POI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ville
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coordonnées
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modèle 3D
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPOIs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Aucun POI trouvé.
                </td>
              </tr>
            ) : (
              filteredPOIs.map((poi) => (
                <tr key={poi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                        <MapPinIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{poi.nom}</div>
                        <div className="text-sm text-gray-500">ID: {poi.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={poi.description}>
                      {poi.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {poi.city?.nom || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>Lat: {poi.latitude.toFixed(4)}</span>
                      <span>Lng: {poi.longitude.toFixed(4)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {poi.modelUrl ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Disponible
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Non disponible
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        title="Voir les détails"
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        title="Modifier"
                        className="text-primary hover:text-primary-light transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        title="Supprimer"
                        onClick={() => handleDeletePOI(poi.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
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
