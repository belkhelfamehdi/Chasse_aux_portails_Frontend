import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ProfilePictureUpload from '../inputs/ProfilePictureUpload';
import FileUpload from '../inputs/FileUpload';

interface AddPOIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: POIFormData) => void;
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

const AddPOIModal: React.FC<AddPOIModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        latitude: '',
        longitude: '',
        iconUrl: '',
        modelUrl: '',
        cityId: 1
    });
    const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
    const [selectedModel, setSelectedModel] = useState<File | null>(null);

    const handleSubmit = () => {
        const poiData: POIFormData = {
            nom: formData.nom,
            description: formData.description,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            iconUrl: selectedIcon ? URL.createObjectURL(selectedIcon) : formData.iconUrl,
            modelUrl: selectedModel ? URL.createObjectURL(selectedModel) : formData.modelUrl,
            cityId: formData.cityId
        };

        onSubmit(poiData);
        
        // Reset form
        setFormData({
            nom: '',
            description: '',
            latitude: '',
            longitude: '',
            iconUrl: '',
            modelUrl: '',
            cityId: 1
        });
        setSelectedIcon(null);
        setSelectedModel(null);
        onClose();
    };

    const handleIconSelect = (file: File | null) => {
        setSelectedIcon(file);
        if (file) {
            const iconUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, iconUrl }));
        } else {
            setFormData(prev => ({ ...prev, iconUrl: '' }));
        }
    };

    const handleModelSelect = (file: File | null) => {
        setSelectedModel(file);
        if (file) {
            const modelUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, modelUrl }));
        } else {
            setFormData(prev => ({ ...prev, modelUrl: '' }));
        }
    };

    const isFormValid = formData.nom && formData.latitude && formData.longitude;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4" style={{ backgroundColor: 'white' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b" style={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}>
                    <h2 className="text-lg font-semibold" style={{ color: '#1f2937' }}>Ajouter POIs</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6" style={{ backgroundColor: 'white' }}>
                    {/* POI Icon Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="text-center">
                            <ProfilePictureUpload 
                                onImageSelect={handleIconSelect}
                                currentImage={formData.iconUrl}
                                size="lg"
                                className="mb-2"
                            />
                            <p className="text-sm text-gray-600">Icône du POI</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* POI Name */}
                        <input
                            type="text"
                            placeholder="Entrez Nom du POI"
                            value={formData.nom}
                            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                            className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ 
                                borderColor: '#e5e7eb', 
                                backgroundColor: 'white',
                                color: '#1f2937'
                            }}
                        />

                        {/* Coordinates */}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                placeholder="Entrez Latitude"
                                value={formData.latitude}
                                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                                style={{ 
                                    borderColor: '#e5e7eb', 
                                    backgroundColor: 'white',
                                    color: '#1f2937'
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Entrez Longitude"
                                value={formData.longitude}
                                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                                style={{ 
                                    borderColor: '#e5e7eb', 
                                    backgroundColor: 'white',
                                    color: '#1f2937'
                                }}
                            />
                        </div>

                        {/* City Selection */}
                        <select
                            value={formData.cityId}
                            onChange={(e) => setFormData(prev => ({ ...prev, cityId: parseInt(e.target.value) }))}
                            className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ 
                                borderColor: '#e5e7eb', 
                                backgroundColor: 'white',
                                color: '#1f2937'
                            }}
                        >
                            <option value="">Sélectionnez une ville</option>
                            <option value={1}>Paris</option>
                            <option value={2}>New York</option>
                            <option value={3}>Tokyo</option>
                            <option value={4}>Londres</option>
                            <option value={5}>Madrid</option>
                        </select>

                        {/* File Upload Section */}
                        <FileUpload
                            onFileSelect={handleModelSelect}
                            acceptedFormats={['GLB', 'OBJ', 'FBX']}
                            label="Charger un Modèle"
                            maxSize={10}
                            className="mb-4"
                        />

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                            className="w-full py-3 rounded-lg font-medium transition-colors"
                            style={{
                                backgroundColor: isFormValid ? '#23B2A4' : '#d1d5db',
                                color: isFormValid ? 'white' : '#6b7280',
                                cursor: isFormValid ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Ajouter POI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPOIModal;
export type { POIFormData };
