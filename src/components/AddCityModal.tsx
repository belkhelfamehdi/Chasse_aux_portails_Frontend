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

interface AddCityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CityFormData) => void;
}

interface CityFormData {
    name: string;
    country: string;
    description?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    status: 'active' | 'inactive';
}

const AddCityModal: React.FC<AddCityModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        description: '',
        latitude: '',
        longitude: '',
        status: 'active'
    });

    const statusOptions: DropdownOption[] = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ];

    const handleSubmit = () => {
        const cityData: CityFormData = {
            name: formData.name,
            country: formData.country,
            description: formData.description || undefined,
            status: formData.status as 'active' | 'inactive',
            coordinates: formData.latitude && formData.longitude ? {
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            } : undefined
        };

        onSubmit(cityData);
        
        // Reset form
        setFormData({
            name: '',
            country: '',
            description: '',
            latitude: '',
            longitude: '',
            status: 'active'
        });
        onClose();
    };

    const isFormValid = formData.name && formData.country;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajouter une ville"
        >
            <div className="p-6 space-y-4">
                {/* City Name */}
                <TextInput
                    placeholder="Nom de la ville"
                    value={formData.name}
                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                />

                {/* Country */}
                <TextInput
                    placeholder="Pays"
                    value={formData.country}
                    onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                />

                {/* Description */}
                <TextArea
                    placeholder="Description (optionnel)"
                    value={formData.description}
                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                    rows={3}
                />

                {/* Coordinates */}
                <CoordinateInput
                    latitudeValue={formData.latitude}
                    longitudeValue={formData.longitude}
                    onLatitudeChange={(value) => setFormData(prev => ({ ...prev, latitude: value }))}
                    onLongitudeChange={(value) => setFormData(prev => ({ ...prev, longitude: value }))}
                />

                {/* Status Selection */}
                <Dropdown
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    placeholder="Statut"
                />

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        label="Annuler"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    />
                    <Button
                        label="Ajouter la ville"
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

export default AddCityModal;
export type { CityFormData };
