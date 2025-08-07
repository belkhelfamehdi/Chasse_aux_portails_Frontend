import { useState } from 'react';
import {
    Modal,
    TextInput,
    CoordinateInput,
    Button
} from './inputs/index';

interface AddCityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CityFormData) => void;
}

interface CityFormData {
    nom: string;
    latitude: number;
    longitude: number;
    rayon: number;
    adminId?: number;
}

const AddCityModal: React.FC<AddCityModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        nom: '',
        latitude: '',
        longitude: '',
        rayon: '',
        adminId: undefined
    });

    const handleSubmit = () => {
        const cityData: CityFormData = {
            nom: formData.nom,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            rayon: parseInt(formData.rayon),
            adminId: formData.adminId
        };

        onSubmit(cityData);
        
        // Reset form
        setFormData({
            nom: '',
            latitude: '',
            longitude: '',
            rayon: '',
            adminId: undefined
        });
        onClose();
    };

    const isFormValid = formData.nom && 
                       formData.latitude !== '' && 
                       formData.longitude !== '' &&
                       formData.rayon !== '';

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
                    value={formData.nom}
                    onChange={(value) => setFormData(prev => ({ ...prev, nom: value }))}
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

                {/* Radius */}
                <TextInput
                    type="number"
                    placeholder="Rayon (en km)"
                    value={formData.rayon}
                    onChange={(value) => setFormData(prev => ({ ...prev, rayon: value }))}
                />

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        label="Annuler"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    />
                    <Button
                        label="Ajouter ville"
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
