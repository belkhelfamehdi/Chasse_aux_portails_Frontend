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
    description: string;
    latitude: string;
    longitude: string;
    email: string;
    role: string;
}

const AddCityModal: React.FC<AddCityModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<CityFormData>({
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        email: '',
        role: ''
    });

    const roleOptions: DropdownOption[] = [
        { value: 'admin', label: 'Administrateur' },
        { value: 'moderator', label: 'Modérateur' },
        { value: 'user', label: 'Utilisateur' },
        { value: 'contributor', label: 'Contributeur' }
    ];

    const handleSubmit = () => {
        onSubmit(formData);
        // Reset form
        setFormData({
            name: '',
            description: '',
            latitude: '',
            longitude: '',
            email: '',
            role: ''
        });
        onClose();
    };

    const isFormValid = formData.name && formData.description && formData.latitude && formData.longitude && formData.email && formData.role;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajouter une ville"
        >
            <div className="p-6 space-y-4">
                {/* City Name */}
                <TextInput
                    placeholder="Entrez Nom de la ville"
                    value={formData.name}
                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                />

                {/* Description */}
                <TextArea
                    placeholder="Entrez une description"
                    value={formData.description}
                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                    rows={4}
                />

                {/* Coordinates */}
                <CoordinateInput
                    latitudeValue={formData.latitude}
                    longitudeValue={formData.longitude}
                    onLatitudeChange={(value) => setFormData(prev => ({ ...prev, latitude: value }))}
                    onLongitudeChange={(value) => setFormData(prev => ({ ...prev, longitude: value }))}
                />

                {/* Email */}
                <TextInput
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                />

                {/* Role Selection */}
                <Dropdown
                    options={roleOptions}
                    value={formData.role}
                    onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                    placeholder="Sélectionnez un rôle"
                />

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <Button
                        label="Ajouter admin"
                        onClick={handleSubmit}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            isFormValid 
                                ? 'bg-teal-500 hover:bg-teal-600 text-white cursor-pointer' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default AddCityModal;
export type { CityFormData };
