import React, { useEffect, useState, useCallback } from 'react';
import Loading from '../Loading';
import Button from '../Button';
import AddPOIModal, { type POIFormData } from '../modals/AddPOIModal';
import EditPOIModal from '../modals/EditPOIModal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import Model3DViewerModal from '../modals/Model3DViewerModal';
import { citiesAPI, poisAPI } from '../../services/api';

interface City {
    id: number;
    nom: string;
    latitude: number;
    longitude: number;
    rayon: number;
    adminId?: number;
}

interface POI {
    id: number;
    nom: string;
    description: string;
    latitude: number;
    longitude: number;
    iconUrl: string;
    modelUrl: string;
    cityId: number;
    city?: City;
}

interface CityDetailsContentProps {
    cityId: string;
}

const CityDetailsContent: React.FC<CityDetailsContentProps> = ({ cityId }) => {
    const [city, setCity] = useState<City | null>(null);
    const [pois, setPois] = useState<POI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPOI, setEditingPOI] = useState<POI | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [poiToDelete, setPOIToDelete] = useState<POI | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // 3D Viewer modal states
    const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
    const [viewing3DPOI, setViewing3DPOI] = useState<POI | null>(null);

    const loadCityData = useCallback(async () => {
        if (!cityId) {
            setError('ID de ville manquant');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Charger les détails de la ville
            const cityResponse = await citiesAPI.getById(parseInt(cityId));
            setCity(cityResponse as City);

            // Charger les POIs de cette ville
            try {
                const poisResponse = await poisAPI.getByCity(parseInt(cityId));
                setPois(Array.isArray(poisResponse) ? poisResponse : []);
            } catch {
                // Si erreur lors du chargement des POIs, on continue avec un tableau vide
                console.log('Aucun POI trouvé pour cette ville ou erreur lors du chargement');
                setPois([]);
            }

        } catch (err) {
            console.error('Erreur lors du chargement des données de la ville:', err);
            setError('Erreur lors du chargement des données de la ville');
        } finally {
            setLoading(false);
        }
    }, [cityId]);

    useEffect(() => {
        loadCityData();
    }, [loadCityData]);

    const formatCoordinates = (lat: number, lng: number) => {
        const latDir = lat >= 0 ? 'N' : 'S';
        const lngDir = lng >= 0 ? 'E' : 'W';
        return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
    };

    const getIconDisplay = (poi: POI) => {
        // If POI has an uploaded icon, display it as an image
        if (poi.iconUrl && poi.iconUrl.trim() !== '') {
            return (
                <img 
                    src={poi.iconUrl} 
                    alt={`Icon for ${poi.nom}`}
                    className="object-cover w-8 h-8 border border-gray-200 rounded"
                    onError={(e) => {
                        // Fallback to emoji if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                            parent.innerHTML = getEmojiForPOI(poi);
                            parent.className = "text-2xl";
                        }
                    }}
                />
            );
        }
        
        // Fallback to emoji
        return <span className="text-2xl">{getEmojiForPOI(poi)}</span>;
    };

    const getEmojiForPOI = (poi: POI) => {
        // Retourner des icônes spécifiques selon le screenshot
        const name = poi.nom.toLowerCase();
        if (name.includes('fountain') || name.includes('fontaine')) return '⛲';
        if (name.includes('tower') || name.includes('tour')) return '🏢';
        if (name.includes('square') || name.includes('place')) return '🏛️';
        if (name.includes('museum') || name.includes('musée')) return '🏛️';
        if (name.includes('bridge') || name.includes('pont')) return '🌉';
        return '📍';
    };

    const handleAddPOI = async (poiData: POIFormData) => {
        try {
            setIsSubmitting(true);
            
            // S'assurer que le cityId est inclus
            const poiDataWithCity = {
                ...poiData,
                cityId: city?.id || parseInt(cityId)
            };
            
            await poisAPI.create(poiDataWithCity);
            
            // Recharger les POIs après création réussie
            await loadCityData();
            setIsAddModalOpen(false);
        } catch (err) {
            console.error('Erreur lors de la création du POI:', err);
            throw err; // Re-throw to let the modal handle the error display
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditPOI = (poi: POI) => {
        setEditingPOI(poi);
        setIsEditModalOpen(true);
    };

    const handleUpdatePOI = async (updateData: Partial<POI>) => {
        if (!editingPOI) return;
        
        try {
            setIsSubmitting(true);
            await poisAPI.update(editingPOI.id, updateData);
            
            // Recharger les POIs après mise à jour réussie
            await loadCityData();
            setIsEditModalOpen(false);
            setEditingPOI(null);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du POI:', err);
            throw err; // Re-throw to let the modal handle the error display
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePOI = async (poi: POI) => {
        setPOIToDelete(poi);
        setIsDeleteModalOpen(true);
    };

    const confirmDeletePOI = async () => {
        if (!poiToDelete) return;
        
        try {
            setIsDeleting(true);
            await poisAPI.delete(poiToDelete.id);
            
            // Recharger les POIs après suppression réussie
            await loadCityData();
            
            // Fermer le modal et réinitialiser
            setIsDeleteModalOpen(false);
            setPOIToDelete(null);
        } catch (err) {
            console.error('Erreur lors de la suppression du POI:', err);
            alert('Erreur lors de la suppression du POI');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setPOIToDelete(null);
    };

    const open3DViewer = (poi: POI) => {
        setViewing3DPOI(poi);
        setIs3DViewerOpen(true);
    };

    const close3DViewer = () => {
        setIs3DViewerOpen(false);
        setViewing3DPOI(null);
    };

    if (loading) {
        return (
            <div className="p-6">
                <Loading size="lg" message="Loading city details..." className="min-h-96" />
            </div>
        );
    }

    if (error || !city) {
        return (
            <div className="p-6">
                <div className="flex flex-col items-center justify-center gap-4 text-center min-h-96">
                    <h2 className="text-2xl font-bold text-red-500">Erreur</h2>
                    <p className="text-gray-500">{error || 'Ville non trouvée'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">City Details</h1>
                    <p className="text-sm text-primary">Manage city information and associated Points of Interest (POIs).</p>
                </div>
            </div>

            {/* City Information Section */}
            <div className="mb-6 bg-white border border-gray-300 rounded">
                <div className="px-5 py-4 border-b border-gray-300">
                    <h2 className="m-0 text-lg font-semibold text-gray-800">
                        City Information
                    </h2>
                </div>

                <div className="p-5">
                    <div className="grid max-w-2xl grid-cols-2 gap-8">
                        <div>
                            <div className="mb-1 text-xs font-medium text-gray-600">
                                City Name
                            </div>
                            <div className="text-sm text-gray-800">
                                {city.nom}
                            </div>
                        </div>

                        <div>
                            <div className="mb-1 text-xs font-medium text-gray-600">
                                Coordinates
                            </div>
                            <div className="text-sm text-gray-800">
                                {formatCoordinates(city.latitude, city.longitude)}
                            </div>
                        </div>
                    </div>

                    <div className="max-w-xs mt-6">
                        <div className="mb-1 text-xs font-medium text-gray-600">
                            Radius
                        </div>
                        <div className="text-sm text-gray-800">
                            {city.rayon} km
                        </div>
                    </div>
                </div>
            </div>

            {/* POIs Section */}
            <div className="bg-white border border-gray-300 rounded">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300">
                    <h2 className="m-0 text-lg font-semibold text-gray-800">
                        Points d'interets (POIs)
                    </h2>
                    <Button
                        label="Ajouter POI"
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-sm"
                    />
                </div>

                {pois.length === 0 ? (
                    <div className="px-5 py-12 italic text-center text-gray-600">
                        Aucun POI trouvé pour cette ville
                    </div>
                ) : (
                    <div>
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-gray-700 border-b border-gray-300 bg-gray-50">
                            <div className="col-span-1">Icon</div>
                            <div className="col-span-2">Name</div>
                            <div className="col-span-3">Description</div>
                            <div className="col-span-2">Coordinates</div>
                            <div className="col-span-1">3D Model</div>
                            <div className="col-span-3">Actions</div>
                        </div>

                        {/* Table Rows */}
                        {pois.map((poi, index) => (
                            <div key={poi.id} className={`grid grid-cols-12 gap-4 px-5 py-4 items-center ${index < pois.length - 1 ? 'border-b border-gray-100' : ''
                                } ${index % 2 === 1 ? 'bg-gray-25' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                                <div className="col-span-1 text-xl text-center">
                                    {getIconDisplay(poi)}
                                </div>
                                <div className="col-span-2 text-sm font-medium text-gray-800">
                                    {poi.nom}
                                </div>
                                <div className="col-span-3 text-sm leading-relaxed text-cyan-600">
                                    {poi.description}
                                </div>
                                <div className="col-span-2 font-mono text-xs font-medium text-cyan-600">
                                    {formatCoordinates(poi.latitude, poi.longitude)}
                                </div>
                                <div className="col-span-1 text-center">
                                    {poi.modelUrl && poi.modelUrl.trim().length > 0 && poi.modelUrl !== '' ? (
                                        <button
                                            onClick={() => open3DViewer(poi)}
                                            className="flex items-center justify-center w-8 h-8 transition-colors bg-blue-100 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-200"
                                            title={`Voir le modèle 3D: ${poi.modelUrl}`}
                                        >
                                            <div className="w-4 h-4 transform bg-blue-500 rounded rotate-12"></div>
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg" title="Pas de modèle 3D disponible">
                                            <span className="text-xs text-gray-400">N/A</span>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-3">
                                    <button 
                                        onClick={() => handleEditPOI(poi)}
                                        className="mr-1 text-xs text-blue-600 underline transition-colors bg-transparent border-none cursor-pointer hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                    <span className="mx-1 text-xs text-blue-600">|</span>
                                    <button 
                                        onClick={() => handleDeletePOI(poi)}
                                        className="ml-1 text-xs text-blue-600 underline transition-colors bg-transparent border-none cursor-pointer hover:text-blue-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add POI Modal */}
            {city && (
                <AddPOIModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddPOI}
                    isLoading={isSubmitting}
                />
            )}

            {/* Edit POI Modal */}
            <EditPOIModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingPOI(null);
                }}
                initialPOI={editingPOI}
                onSubmit={handleUpdatePOI}
                isLoading={isSubmitting}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={cancelDelete}
                onConfirm={confirmDeletePOI}
                title="Supprimer le POI"
                message="Êtes-vous sûr de vouloir supprimer ce point d'intérêt ?"
                itemName={poiToDelete?.nom}
                isDeleting={isDeleting}
            />

            {/* 3D Model Viewer Modal */}
            <Model3DViewerModal
                isOpen={is3DViewerOpen}
                onClose={close3DViewer}
                modelUrl={viewing3DPOI?.modelUrl || ''}
                modelName={viewing3DPOI?.nom || 'Modèle 3D'}
            />
        </div>
    );
};

export default CityDetailsContent;
