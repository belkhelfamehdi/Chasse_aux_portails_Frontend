import React, { useState } from 'react';
import {
    Modal,
    TextInput,
    CoordinateInput,
    Dropdown,
    FileUpload,
    Button,
    type DropdownOption
} from './inputs/index';

interface AddPOIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: POIFormData) => void;
}

interface POIFormData {
    name: string;
    latitude: string;
    longitude: string;
    city: string;
    model: File | null;
    profilePicture: File | null;
}

const AddPOIModal: React.FC<AddPOIModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<POIFormData>({
        name: '',
        latitude: '',
        longitude: '',
        city: '',
        model: null,
        profilePicture: null
    });

    const cityOptions: DropdownOption[] = [
        { value: 'paris', label: 'Paris' },
        { value: 'lyon', label: 'Lyon' },
        { value: 'marseille', label: 'Marseille' },
        { value: 'toulouse', label: 'Toulouse' },
        { value: 'nice', label: 'Nice' },
        { value: 'bordeaux', label: 'Bordeaux' },
        { value: 'lille', label: 'Lille' },
        { value: 'strasbourg', label: 'Strasbourg' }
    ];

    const handleSubmit = () => {
        onSubmit(formData);
        // Reset form
        setFormData({
            name: '',
            latitude: '',
            longitude: '',
            city: '',
            model: null,
            profilePicture: null
        });
        onClose();
    };

    const isFormValid = formData.name && formData.latitude && formData.longitude && formData.city;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajouter POIs"
        >
            <div className="p-6 space-y-4">
                {/* Profile Picture Icon */}
                <div className="flex justify-center mb-6">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-2">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path 
                                    d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
                                    fill="#14B8A6"
                                    stroke="#14B8A6" 
                                    strokeWidth="1" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        {/* Small edit icon */}
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center -mt-3 ml-8">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path 
                                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" 
                                    stroke="white" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* POI Name */}
                <TextInput
                    placeholder="Entrez Nom du POI"
                    value={formData.name}
                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                />

                {/* Coordinates */}
                <CoordinateInput
                    latitudeValue={formData.latitude}
                    longitudeValue={formData.longitude}
                    onLatitudeChange={(value) => setFormData(prev => ({ ...prev, latitude: value }))}
                    onLongitudeChange={(value) => setFormData(prev => ({ ...prev, longitude: value }))}
                />

                {/* City Selection */}
                <Dropdown
                    options={cityOptions}
                    value={formData.city}
                    onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                    placeholder="Sélectionnez une ville"
                />

                {/* File Upload */}
                <FileUpload
                    onFileSelect={(file) => setFormData(prev => ({ ...prev, model: file }))}
                />

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <Button
                        label="Ajouter POI"
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

export default AddPOIModal;
export type { POIFormData };
