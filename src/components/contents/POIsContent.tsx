import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { poisAPI } from '../../services/api';
import AddPOIModal from '../modals/AddPOIModal';
import EditPOIModal from '../modals/EditPOIModal';
import Model3DViewerModal from '../modals/Model3DViewerModal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPOI, setEditingPOI] = useState<POI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [viewing3DPOI, setViewing3DPOI] = useState<POI | null>(null);

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [poiToDelete, setPoiToDelete] = useState<POI | null>(null);

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

  const handleDeletePOI = async (poi: POI) => {
    setPoiToDelete(poi);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePOI = async () => {
    if (!poiToDelete) return;

    try {
      setIsDeleting(poiToDelete.id);
      await poisAPI.delete(poiToDelete.id);
      await loadPOIs(); // Reload the list to get fresh data
      
      // Close modal and reset
      setIsDeleteModalOpen(false);
      setPoiToDelete(null);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du POI:', error);
      alert('Erreur lors de la suppression du POI. Veuillez réessayer.');
    } finally {
      setIsDeleting(null);
    }
  };

  const cancelDeletePOI = () => {
    setIsDeleteModalOpen(false);
    setPoiToDelete(null);
  };

  const openEdit = (poi: POI) => {
    setEditingPOI(poi);
    setIsEditModalOpen(true);
  };

  const handleEditPOI = async (data: Partial<POIFormData>) => {
    if (!editingPOI) return;
    try {
      setIsSubmitting(true);
      await poisAPI.update(editingPOI.id, data);
      await loadPOIs();
      setIsEditModalOpen(false);
      setEditingPOI(null);
    } catch (error) {
      console.error('Error updating POI:', error);
      alert('Erreur lors de la mise à jour du POI.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const open3DViewer = (poi: POI) => {
    setViewing3DPOI(poi);
    setIs3DViewerOpen(true);
  };

  const close3DViewer = () => {
    setIs3DViewerOpen(false);
    setViewing3DPOI(null);
  };

  const filteredPOIs = pois.filter(poi => {
    const matchesSearch = poi.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getIconDisplay = (iconUrl?: string) => {
    if (!iconUrl || iconUrl.trim() === '') {
      // Icône par défaut si pas d'URL fournie
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
          <span className="text-lg">📍</span>
        </div>
      );
    }
    
    // Afficher la vraie image comme pour les photos de profil des admins
    return (
      <img
        src={iconUrl}
        alt="POI Icon"
        className="object-cover w-8 h-8 rounded-lg"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // En cas d'erreur, afficher l'icône par défaut
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = '<div class="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg"><span class="text-lg">📍</span></div>';
          }
        }}
      />
    );
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
                Nom
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Description
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Ville
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Coordonnées
              </th>
              <th className="px-6 py-3 text-sm font-medium text-center text-gray-500">
                Icône
              </th>
              <th className="px-6 py-3 text-sm font-medium text-center text-gray-500">
                Modèle 3D
              </th>
              <th className="px-6 py-3 text-sm font-medium text-right text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPOIs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Aucun POI trouvé.
                </td>
              </tr>
            ) : (
              filteredPOIs.map((poi) => (
                <tr key={poi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {poi.nom}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {poi.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary font-medium">
                    {poi.city?.nom || `Ville ID: ${poi.cityId}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="space-y-1">
                      <div>Lat: {poi.latitude.toFixed(6)}°</div>
                      <div>Lng: {poi.longitude.toFixed(6)}°</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      {getIconDisplay(poi.iconUrl)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {poi.modelUrl && poi.modelUrl.trim().length > 0 && poi.modelUrl !== '' ? (
                      <div className="flex flex-col items-center space-y-1">
                        <button
                          onClick={() => open3DViewer(poi)}
                          className="flex items-center justify-center w-10 h-10 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                          title={`Voir le modèle 3D: ${poi.modelUrl}`}
                        >
                          <div className="w-5 h-5 bg-blue-500 rounded transform rotate-12"></div>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-1">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg" title="Pas de modèle 3D disponible">
                          <span className="text-xs text-gray-400">N/A</span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        title="Modifier"
                        onClick={() => openEdit(poi)}
                        className="text-link transition-colors cursor-pointer"
                      >
                        <span className="text-sm">Edit</span>
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        title="Supprimer"
                        onClick={() => handleDeletePOI(poi)}
                        disabled={isDeleting === poi.id}
                        className="text-link transition-colors cursor-pointer disabled:opacity-50"
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

      {/* Edit POI Modal */}
      <EditPOIModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialPOI={editingPOI}
        onSubmit={handleEditPOI}
        isLoading={isSubmitting}
      />

      {/* 3D Model Viewer Modal */}
      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={close3DViewer}
        modelUrl={viewing3DPOI?.modelUrl || ''}
        modelName={viewing3DPOI?.nom || 'Modèle 3D'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeletePOI}
        onConfirm={confirmDeletePOI}
        title="Supprimer le POI"
        message={`Êtes-vous sûr de vouloir supprimer le POI "${poiToDelete?.nom || ''}" ? Cette action est irréversible.`}
        itemName={poiToDelete?.nom || ''}
        isDeleting={isDeleting === poiToDelete?.id}
      />
    </div>
  );
}
