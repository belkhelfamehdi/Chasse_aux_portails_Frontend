import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { poisAPI } from '../../services/api';
import { useNotifications } from '../../contexts/useNotifications';
import EditPOIModal from '../modals/EditPOIModal';
import AddPOIModal from '../modals/AddPOIModal';
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

export default function AdminPOIsContent() {
  const { success, error } = useNotifications();
  const [pois, setPois] = useState<POI[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPOI, setEditingPOI] = useState<POI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [viewing3DPOI, setViewing3DPOI] = useState<POI | null>(null);

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [poiToDelete, setPOIToDelete] = useState<POI | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Charger les POIs de l'admin directement via l'API
      const poisResponse = await poisAPI.getAdminPOIs();
      const adminPOIs = poisResponse as POI[];
      
      setPois(adminPOIs);
    } catch (err) {
      console.error('Error loading data:', err);
      error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEditPOI = (poi: POI) => {
    setEditingPOI(poi);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPOI(null);
  };

  const handleAddPOI = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCreatePOI = async (poiData: POIFormData) => {
    if (!poiData.nom) return;
    
    try {
      setIsSubmitting(true);
      const newPOI = await poisAPI.createAsAdmin(poiData);
      setPois(prev => [...prev, newPOI as POI]);
      success('Point d\'intérêt créé avec succès');
      handleCloseAddModal();
    } catch (err) {
      console.error('Error creating POI:', err);
      error('Erreur lors de la création du point d\'intérêt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePOI = async (poiData: Partial<POIFormData>) => {
    if (!editingPOI || !poiData.nom) return;
    
    try {
      setIsSubmitting(true);
      const updatedPOI = await poisAPI.updateAsAdmin(editingPOI.id, poiData as POIFormData);
      setPois(prev => prev.map(poi => 
        poi.id === editingPOI.id ? { ...poi, ...updatedPOI as POI } : poi
      ));
      success('Point d\'intérêt mis à jour avec succès');
      handleCloseEditModal();
    } catch (err) {
      console.error('Error updating POI:', err);
      error('Erreur lors de la mise à jour du point d\'intérêt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView3D = (poi: POI) => {
    setViewing3DPOI(poi);
    setIs3DViewerOpen(true);
  };

  const handleClose3DViewer = () => {
    setIs3DViewerOpen(false);
    setViewing3DPOI(null);
  };

  const handleDeletePOI = (poi: POI) => {
    setPOIToDelete(poi);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPOIToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!poiToDelete) return;
    
    try {
      setIsDeleting(poiToDelete.id);
      await poisAPI.deleteAsAdmin(poiToDelete.id);
      setPois(prev => prev.filter(poi => poi.id !== poiToDelete.id));
      success('Point d\'intérêt supprimé avec succès');
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Error deleting POI:', err);
      error('Erreur lors de la suppression du point d\'intérêt');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredPOIs = pois.filter(poi =>
    poi.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poi.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poi.city?.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
          </div>
        </div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ynov-primary font-montserrat">Mes Points d'Intérêt</h2>
          <p className="text-ynov-secondary font-source-sans">Gérez les points d'intérêt dans vos villes</p>
        </div>
        <button
          onClick={handleAddPOI}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-ynov-secondary hover:bg-ynov-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ynov-secondary transition-colors font-source-sans"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un POI
        </button>
      </div>

      {/* Search */}
      {pois.length > 0 && (
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un point d'intérêt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl focus:ring-ynov-secondary focus:border-transparent font-source-sans"
          />
        </div>
      )}

      {/* Content */}
      {pois.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun point d'intérêt</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun point d'intérêt n'est configuré dans vos villes.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ynov-primary uppercase tracking-wider font-source-sans">
                    Point d'Intérêt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ynov-primary uppercase tracking-wider font-source-sans">
                    Ville
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ynov-primary uppercase tracking-wider font-source-sans">
                    Coordonnées
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ynov-primary uppercase tracking-wider font-source-sans">
                    Média
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-ynov-primary uppercase tracking-wider font-source-sans">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPOIs.map((poi) => (
                  <tr key={poi.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-ynov-primary font-source-sans">{poi.nom}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs font-source-sans">{poi.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ynov-primary font-source-sans">
                      {poi.city?.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {poi.latitude.toFixed(6)}, {poi.longitude.toFixed(6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {poi.iconUrl && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Icône
                          </span>
                        )}
                        {poi.modelUrl && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Modèle 3D
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {poi.modelUrl && (
                        <Button
                          label="Voir 3D"
                          className="bg-blue-500 hover:bg-blue-600 text-xs py-1 px-2"
                          onClick={() => handleView3D(poi)}
                        />
                      )}
                      <Button
                        label="Modifier"
                        className="bg-gray-500 hover:bg-gray-600 text-xs py-1 px-2"
                        onClick={() => handleEditPOI(poi)}
                      />
                      <Button
                        label="Supprimer"
                        className="bg-red-500 hover:bg-red-600 text-xs py-1 px-2"
                        onClick={() => handleDeletePOI(poi)}
                        disabled={isDeleting === poi.id}
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
      {isEditModalOpen && editingPOI && (
        <EditPOIModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialPOI={editingPOI}
          onSubmit={handleUpdatePOI}
          isLoading={isSubmitting}
        />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddPOIModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSubmit={handleCreatePOI}
          isLoading={isSubmitting}
          isAdminMode={true}
        />
      )}

      {/* 3D Viewer Modal */}
      {is3DViewerOpen && viewing3DPOI && (
        <Model3DViewerModal
          isOpen={is3DViewerOpen}
          onClose={handleClose3DViewer}
          modelUrl={viewing3DPOI.modelUrl!}
          modelName={viewing3DPOI.nom}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && poiToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Supprimer le point d'intérêt"
          message={`Êtes-vous sûr de vouloir supprimer le point d'intérêt "${poiToDelete.nom}" ? Cette action est irréversible.`}
          isDeleting={isDeleting === poiToDelete.id}
        />
      )}
    </div>
  );
}
