import React, { useEffect, useState, useCallback } from 'react';
import Loading from '../Loading';
import Button from '../Button';
import AddPOIModal, { type POIFormData } from '../modals/AddPOIModal';
import EditPOIModal from '../modals/EditPOIModal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
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

    const loadCityData = useCallback(async () => {
        if (!cityId) {
            setError('ID de ville manquant');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Charger les détails de la ville
            const cityResponse = await citiesAPI.getById(parseInt(cityId));
            setCity(cityResponse as City);

            // Charger les POIs de cette ville
            const poisResponse = await poisAPI.getByCity(parseInt(cityId));
            setPois(Array.isArray(poisResponse) ? poisResponse : []);

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

    const getIconForPOI = (poi: POI) => {
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
                <div className="min-h-96 flex flex-col items-center justify-center text-center gap-4">
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
            <div className="bg-white border border-gray-300 rounded mb-6">
                <div className="px-5 py-4 border-b border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-800 m-0">
                        City Information
                    </h2>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-2 gap-8 max-w-2xl">
                        <div>
                            <div className="text-gray-600 text-xs font-medium mb-1">
                                City Name
                            </div>
                            <div className="text-gray-800 text-sm">
                                {city.nom}
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-600 text-xs font-medium mb-1">
                                Coordinates
                            </div>
                            <div className="text-gray-800 text-sm">
                                {formatCoordinates(city.latitude, city.longitude)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 max-w-xs">
                        <div className="text-gray-600 text-xs font-medium mb-1">
                            Radius
                        </div>
                        <div className="text-gray-800 text-sm">
                            {city.rayon} km
                        </div>
                    </div>
                </div>
            </div>

            {/* POIs Section */}
            <div className="bg-white border border-gray-300 rounded">
                <div className="px-5 py-4 border-b border-gray-300 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800 m-0">
                        Points d'interets (POIs)
                    </h2>
                    <Button
                        label="Ajouter POI"
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-sm"
                    />
                </div>

                {pois.length === 0 ? (
                    <div className="text-center py-12 px-5 text-gray-600 italic">
                        Aucun POI trouvé pour cette ville
                    </div>
                ) : (
                    <div>
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-300 text-xs font-semibold text-gray-700">
                            <div className="col-span-3">Name</div>
                            <div className="col-span-4">Description</div>
                            <div className="col-span-2">Coordinates</div>
                            <div className="col-span-1">Icon/Model</div>
                            <div className="col-span-2">Actions</div>
                        </div>

                        {/* Table Rows */}
                        {pois.map((poi, index) => (
                            <div key={poi.id} className={`grid grid-cols-12 gap-4 px-5 py-4 items-center ${index < pois.length - 1 ? 'border-b border-gray-100' : ''
                                } ${index % 2 === 1 ? 'bg-gray-25' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                                <div className="col-span-3 text-sm text-gray-800 font-medium">
                                    {poi.nom}
                                </div>
                                <div className="col-span-4 text-sm text-cyan-600 leading-relaxed">
                                    {poi.description}
                                </div>
                                <div className="col-span-2 text-xs text-cyan-600 font-mono font-medium">
                                    {formatCoordinates(poi.latitude, poi.longitude)}
                                </div>
                                <div className="col-span-1 text-xl text-center">
                                    {getIconForPOI(poi)}
                                </div>
                                <div className="col-span-2">
                                    <button 
                                        onClick={() => handleEditPOI(poi)}
                                        className="text-blue-600 text-xs underline mr-1 hover:text-blue-800 transition-colors cursor-pointer bg-transparent border-none"
                                    >
                                        Edit
                                    </button>
                                    <span className="text-blue-600 text-xs mx-1">|</span>
                                    <button 
                                        onClick={() => handleDeletePOI(poi)}
                                        className="text-blue-600 text-xs underline ml-1 hover:text-blue-800 transition-colors cursor-pointer bg-transparent border-none"
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
        </div>
    );
};

export default CityDetailsContent;
