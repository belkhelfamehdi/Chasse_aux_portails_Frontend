import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
        email: '',
        adminId: undefined as number | undefined
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
            email: '',
            adminId: undefined
        });
        onClose();
    };

    const isFormValid = formData.nom &&
        formData.latitude !== '' &&
        formData.longitude !== '' &&
        formData.rayon !== '';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="rounded-lg shadow-lg w-full max-w-md mx-4" style={{ backgroundColor: 'white' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6" style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
                    <h2 className="text-lg font-semibold" style={{ color: '#1f2937' }}>Ajouter une ville</h2>
                    <button
                        onClick={onClose}
                        className="hover:opacity-60 transition-opacity"
                        style={{ color: '#9ca3af' }}
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6" style={{ backgroundColor: 'white' }}>
                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* City Name */}
                        <input
                            type="text"
                            placeholder="Entrez nom de la ville"
                            value={formData.nom}
                            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                            className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{
                                borderColor: '#e5e7eb',
                                backgroundColor: 'white',
                                color: '#1f2937'
                            }}
                        />

                        {/* Description */}
                        <textarea
                            placeholder="Entrez une description"
                            rows={3}
                            className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-none"
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

                        {/* Email */}
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{
                                borderColor: '#e5e7eb',
                                backgroundColor: 'white',
                                color: '#1f2937'
                            }}
                        />

                        {/* Admin Selection */}
                        <select
                            value={formData.adminId ?? ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, adminId: e.target.value ? parseInt(e.target.value) : undefined }))}
                            className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{
                                borderColor: '#e5e7eb',
                                backgroundColor: 'white',
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
                            disabled={!isFormValid}
                            className="w-full py-3 rounded-lg font-medium transition-colors"
                            style={{
                                backgroundColor: isFormValid ? '#23B2A4' : '#d1d5db',
                                color: isFormValid ? 'white' : '#6b7280',
                                cursor: isFormValid ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Ajouter admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCityModal;
export type { CityFormData };
