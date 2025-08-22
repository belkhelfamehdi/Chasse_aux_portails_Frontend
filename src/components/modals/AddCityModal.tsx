import { useState } from 'react';
import Modal from './Modal';
import { TextInput } from '../inputs';
import Loading from '../Loading';

interface AddCityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CityFormData) => void | Promise<void>;
    isLoading?: boolean;
}

interface CityFormData {
    nom: string;
    latitude: number;
    longitude: number;
    rayon: number;
    adminId?: number;
}

const AddCityModal: React.FC<AddCityModalProps> = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState({
        nom: '',
        latitude: '',
        longitude: '',
        rayon: '',
        adminId: undefined as number | undefined
    });

    const handleSubmit = async () => {
        const cityData: CityFormData = {
            nom: formData.nom,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            rayon: parseInt(formData.rayon),
            adminId: formData.adminId
        };

        await onSubmit(cityData);

        // Reset form only if not handled by parent (for async operations)
        if (!isLoading) {
            setFormData({
                nom: '',
                latitude: '',
                longitude: '',
                rayon: '',
                adminId: undefined
            });
        }
    };

    const isFormValid = formData.nom &&
        formData.latitude !== '' &&
        formData.longitude !== '' &&
        formData.rayon !== '';

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une ville">
            <div className="p-6">
                {/* Form Fields */}
                <div className="space-y-4">
                    {/* City Name */}
                    <TextInput
                        placeholder="Entrez nom de la ville"
                        value={formData.nom}
                        onChange={(value) => setFormData(prev => ({ ...prev, nom: value }))}
                        required
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

                    {/* Radius */}
                    <TextInput
                        type="number"
                        placeholder="Rayon (km)"
                        value={formData.rayon}
                        onChange={(value) => setFormData(prev => ({ ...prev, rayon: value }))}
                        required
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
                                    <span className="ml-2">Ajout en cours...</span>
                                </>
                            ) : (
                                'Ajouter ville'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddCityModal;
export type { CityFormData };
