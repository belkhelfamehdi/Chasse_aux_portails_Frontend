import React, { useState } from 'react';
import {
    Modal,
    TextInput,
    TextArea,
    CoordinateInput,
    Dropdown,
    Button,
    type DropdownOption
} from './inputs/index';

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

    // Mock cities (should come from props or API in real app)
    const cityOptions: DropdownOption[] = [
        { value: '1', label: 'Paris' },
        { value: '2', label: 'New York' },
        { value: '3', label: 'Tokyo' },
        { value: '4', label: 'Londres' },
        { value: '5', label: 'Madrid' }
    ];

    const handleSubmit = () => {
        const poiData: POIFormData = {
            nom: formData.nom,
            description: formData.description,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            iconUrl: formData.iconUrl,
            modelUrl: formData.modelUrl,
            cityId: parseInt(formData.cityId.toString())
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

    const isFormValid = formData.nom && 
                       formData.description && 
                       formData.latitude !== '' && 
                       formData.longitude !== '' &&
                       formData.iconUrl &&
                       formData.modelUrl &&
                       formData.cityId;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajouter un Point d'Intérêt"
        >
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {/* POI Name */}
                <TextInput
                    placeholder="Nom du POI"
                    value={formData.nom}
                    onChange={(value) => setFormData(prev => ({ ...prev, nom: value }))}
                />

                {/* Description */}
                <TextArea
                    placeholder="Description du POI"
                    value={formData.description}
                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                    rows={3}
                />

                {/* City Selection */}
                <Dropdown
                    options={cityOptions}
                    value={formData.cityId.toString()}
                    onChange={(value) => setFormData(prev => ({ ...prev, cityId: parseInt(value) }))}
                    placeholder="Sélectionnez une ville"
                />

                {/* Coordinates */}
                <div>
                    <CoordinateInput
                        latitudeValue={formData.latitude}
                        longitudeValue={formData.longitude}
                        onLatitudeChange={(value) => setFormData(prev => ({ ...prev, latitude: value }))}
                        onLongitudeChange={(value) => setFormData(prev => ({ ...prev, longitude: value }))}
                    />
                </div>

                {/* Icon URL */}
                <TextInput
                    placeholder="URL de l'icône"
                    value={formData.iconUrl}
                    onChange={(value) => setFormData(prev => ({ ...prev, iconUrl: value }))}
                />

                {/* Model URL */}
                <TextInput
                    placeholder="URL du modèle 3D (.glb)"
                    value={formData.modelUrl}
                    onChange={(value) => setFormData(prev => ({ ...prev, modelUrl: value }))}
                />

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        label="Annuler"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    />
                    <Button
                        label="Ajouter POI"
                        onClick={handleSubmit}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            isFormValid 
                                ? 'bg-primary hover:bg-primary-light text-white cursor-pointer' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isFormValid}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default AddPOIModal;
export type { POIFormData };
