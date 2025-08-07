import React, { useState } from 'react';
import { XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

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

    const handleSubmit = () => {
        const poiData: POIFormData = {
            nom: formData.nom,
            description: formData.description,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            iconUrl: formData.iconUrl,
            modelUrl: formData.modelUrl,
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
        onClose();
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
                    {/* POI Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                            <span className="text-2xl">🏛️</span>
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
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                            <CloudArrowUpIcon className="w-12 h-12 text-[#23B2A4] mx-auto mb-4" />
                            <p className="text-sm font-medium text-gray-900 mb-1">Charger un Modèle</p>
                            <p className="text-xs text-gray-500 mb-4">Déposer/insérer formats .gbl, .obj, .fbx</p>
                            <input
                                type="file"
                                accept=".glb,.obj,.fbx"
                                className="hidden"
                                id="model-upload"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFormData(prev => ({ ...prev, modelUrl: file.name }));
                                    }
                                }}
                            />
                            <label
                                htmlFor="model-upload"
                                className="inline-block px-4 py-2 text-xs font-medium text-[#23B2A4] border border-[#23B2A4] rounded-lg hover:bg-[#23B2A4] hover:text-white transition-colors cursor-pointer"
                            >
                                Parcourir
                            </label>
                        </div>

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
