import React, { useState } from 'react';
import {
    Modal,
    TextInput,
    CoordinateInput,
    Dropdown,
    FileUpload,
    ProfilePictureUpload,
    Button,
    type DropdownOption
} from './inputs';

const ExampleUsage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        poiName: '',
        latitude: '',
        longitude: '',
        city: '',
        model: null as File | null,
        profilePicture: null as File | null
    });

    const cityOptions: DropdownOption[] = [
        { value: 'paris', label: 'Paris' },
        { value: 'lyon', label: 'Lyon' },
        { value: 'marseille', label: 'Marseille' },
        { value: 'toulouse', label: 'Toulouse' },
        { value: 'nice', label: 'Nice' }
    ];

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        // Handle form submission here
        setIsModalOpen(false);
    };

    return (
        <div className="p-8">
            <Button
                label="Ajouter POI"
                onClick={() => setIsModalOpen(true)}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Ajouter POIs"
            >
                <div className="p-6 space-y-4">
                    {/* Profile Picture */}
                    <div className="flex justify-center">
                        <ProfilePictureUpload
                            onImageSelect={(file) => setFormData(prev => ({ ...prev, profilePicture: file }))}
                            size="md"
                        />
                    </div>

                    {/* POI Name */}
                    <TextInput
                        placeholder="Entrez Nom du POI"
                        value={formData.poiName}
                        onChange={(value) => setFormData(prev => ({ ...prev, poiName: value }))}
                        required
                    />

                    {/* Coordinates */}
                    <CoordinateInput
                        latitudeValue={formData.latitude}
                        longitudeValue={formData.longitude}
                        onLatitudeChange={(value) => setFormData(prev => ({ ...prev, latitude: value }))}
                        onLongitudeChange={(value) => setFormData(prev => ({ ...prev, longitude: value }))}
                        required
                    />

                    {/* City Selection */}
                    <Dropdown
                        options={cityOptions}
                        value={formData.city}
                        onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                        placeholder="Sélectionnez une ville"
                        required
                    />

                    {/* File Upload */}
                    <FileUpload
                        onFileSelect={(file) => setFormData(prev => ({ ...prev, model: file }))}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            label="Ajouter POI"
                            onClick={handleSubmit}
                            className="bg-teal-500 hover:bg-teal-600"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExampleUsage;
