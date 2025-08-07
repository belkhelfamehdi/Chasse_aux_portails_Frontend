import { useState } from 'react';
import Modal from './Modal';
import { TextInput, TextArea } from '../inputs';
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
        description: '',
        latitude: '',
        longitude: '',
        rayon: '',
        email: '',
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
                description: '',
                latitude: '',
                longitude: '',
                rayon: '',
                email: '',
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

                    {/* Description */}
                    <TextArea
                        placeholder="Entrez une description"
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

                    {/* Radius */}
                    <TextInput
                        type="number"
                        placeholder="Rayon (km)"
                        value={formData.rayon}
                        onChange={(value) => setFormData(prev => ({ ...prev, rayon: value }))}
                        required
                        disabled={isLoading}
                    />

                    {/* Email */}
                    <TextInput
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                        disabled={isLoading}
                    />

                    {/* Admin Selection */}
                    <select
                        value={formData.adminId ?? ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, adminId: e.target.value ? parseInt(e.target.value) : undefined }))}
                        disabled={isLoading}
                        className="w-full px-3 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            borderColor: '#e5e7eb',
                            backgroundColor: isLoading ? '#f9fafb' : 'white',
                            color: '#1f2937'
                        }}
                    >
                        <option value="">Sélectionnez un rôle</option>
                        <option value={1}>Administrateur Principal</option>
                        <option value={2}>Administrateur Secondaire</option>
                        <option value={3}>Gestionnaire</option>
                    </select>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                        className="w-full py-3 font-medium transition-colors rounded-lg flex items-center justify-center"
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
                            'Ajouter ville'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddCityModal;
export type { CityFormData };
