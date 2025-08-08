import React, { useState, useEffect } from 'react';
import ProfilePictureUpload from '../inputs/ProfilePictureUpload';
import FileUpload from '../inputs/FileUpload';
import { TextInput, TextArea, Dropdown } from '../inputs';
import Modal from './Modal';
import Loading from '../Loading';
import { citiesAPI } from '../../services/api';

interface AddPOIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: POIFormData) => void | Promise<void>;
    isLoading?: boolean;
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

interface City {
    id: number;
    nom: string;
}

const AddPOIModal: React.FC<AddPOIModalProps> = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        latitude: '',
        longitude: '',
        iconUrl: '',
        modelUrl: '',
        cityId: 0
    });
    const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
    const [selectedModel, setSelectedModel] = useState<File | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Load cities when modal opens
    useEffect(() => {
        if (isOpen) {
            loadCities();
        }
    }, [isOpen]);

    const loadCities = async () => {
        try {
            setLoadingCities(true);
            const response = await citiesAPI.getAll();
            setCities(response as City[]);
        } catch (error) {
            console.error('Error loading cities:', error);
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    };

    const handleSubmit = async () => {
        const poiData: POIFormData = {
            nom: formData.nom,
            description: formData.description,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            cityId: formData.cityId,
            iconFile: selectedIcon,
            modelFile: selectedModel,
            ...(formData.iconUrl?.trim() && { iconUrl: formData.iconUrl }),
            ...(formData.modelUrl?.trim() && { modelUrl: formData.modelUrl })
        };

        await onSubmit(poiData);

        // Reset form only if not handled by parent (for async operations)
        if (!isLoading) {
            setFormData({
                nom: '',
                description: '',
                latitude: '',
                longitude: '',
                iconUrl: '',
                modelUrl: '',
                cityId: 0
            });
            setSelectedIcon(null);
            setSelectedModel(null);
        }
    };

    const handleIconSelect = (file: File | null) => {
        if (!isLoading) {
            setSelectedIcon(file);
            if (file) {
                const iconUrl = URL.createObjectURL(file);
                setFormData(prev => ({ ...prev, iconUrl }));
            } else {
                setFormData(prev => ({ ...prev, iconUrl: '' }));
            }
        }
    };

    const handleModelSelect = (file: File | null) => {
        if (!isLoading) {
            setSelectedModel(file);
            if (file) {
                const modelUrl = URL.createObjectURL(file);
                setFormData(prev => ({ ...prev, modelUrl }));
            } else {
                setFormData(prev => ({ ...prev, modelUrl: '' }));
            }
        }
    };

    const isFormValid = formData.nom && formData.latitude && formData.longitude && formData.cityId > 0;

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ajouter POIs">
            <div className="p-6">
                {/* POI Icon Upload */}
                <div className="flex justify-center mb-6">
                    <div className="text-center">
                        <ProfilePictureUpload
                            onImageSelect={handleIconSelect}
                            currentImage={formData.iconUrl}
                            size="md"
                            className="mb-2"
                            disabled={isLoading}
                        />
                        <p className="text-sm text-gray-600">Icône du POI</p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    {/* POI Name */}
                    <TextInput
                        placeholder="Entrez Nom du POI"
                        value={formData.nom}
                        onChange={(value) => setFormData(prev => ({ ...prev, nom: value }))}
                        required
                        disabled={isLoading}
                    />

                    {/* Description */}
                    <TextArea
                        placeholder="Description du POI"
                        value={formData.description}
                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                        rows={3}
                        disabled={isLoading}
                    />

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            type="number"
                            placeholder="Entrez Latitude"
                            value={formData.latitude}
                            onChange={(value) => setFormData(prev => ({ ...prev, latitude: value }))}
                            required
                            disabled={isLoading}
                        />
                        <TextInput
                            type="number"
                            placeholder="Entrez Longitude"
                            value={formData.longitude}
                            onChange={(value) => setFormData(prev => ({ ...prev, longitude: value }))}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* City Selection */}
                    <Dropdown
                        options={[
                            { value: '', label: loadingCities ? 'Chargement des villes...' : 'Sélectionnez une ville' },
                            ...cities.map(city => ({
                                value: city.id.toString(),
                                label: city.nom
                            }))
                        ]}
                        value={formData.cityId.toString()}
                        onChange={(value) => setFormData(prev => ({
                            ...prev,
                            cityId: parseInt(value) || 0
                        }))}
                        placeholder={loadingCities ? "Chargement des villes..." : "Sélectionnez une ville"}
                        label="Ville"
                        required
                    />                    {/* File Upload Section */}
                    <FileUpload
                        onFileSelect={handleModelSelect}
                        acceptedFormats={['GLB', 'OBJ', 'FBX']}
                        label="Charger un Modèle"
                        maxSize={10}
                        className="mb-4"
                        disabled={isLoading}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isLoading}
                            className="flex items-center justify-center px-4 py-2 font-normal transition-colors rounded-lg"
                            style={{
                                backgroundColor: (isFormValid && !isLoading) ? '#23B2A4' : '#d1d5db',
                                color: (isFormValid && !isLoading) ? 'white' : '#6b7280',
                                cursor: (isFormValid && !isLoading) ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loading size="sm" />
                                    <span className="ml-2">Adding...</span>
                                </>
                            ) : (
                                'Ajouter POI'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddPOIModal;
export type { POIFormData };
