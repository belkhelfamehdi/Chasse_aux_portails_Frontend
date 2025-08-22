import React, { useState, useEffect } from 'react';
import { ProfilePictureUpload, TextInput, MultiSelectDropdown } from '../inputs';
import Modal from './Modal';
import Loading from '../Loading';
import { citiesAPI } from '../../services/api';

interface AddAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AdminFormData) => void | Promise<void>;
    isLoading?: boolean;
}

interface AdminFormData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    cityIds: number[];
    profilePicture?: File | null;
}

interface City {
    id: number;
    nom: string;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'ADMIN' as 'SUPER_ADMIN' | 'ADMIN',
        cityIds: [] as number[]
    });

    const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Load cities when modal opens
    useEffect(() => {
        if (isOpen) {
            loadCities();
        }
    }, [isOpen]);

    const loadCities = async () => {
        try {
            setLoadingCities(true);
            const response = await citiesAPI.getAll();
            setCities(response as City[]);
        } catch (error) {
            console.error('Error loading cities:', error);
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    };

    const handleProfilePictureSelect = (file: File | null) => {
        setSelectedProfilePicture(file);
    };

    const handleSubmit = async () => {
        const adminData: AdminFormData = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            cityIds: formData.cityIds,
            profilePicture: selectedProfilePicture
        };

        await onSubmit(adminData);

        // Reset form only if not handled by parent (for async operations)
        if (!isLoading) {
            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                role: 'ADMIN',
                cityIds: []
            });
            setSelectedProfilePicture(null);
        }
    };

    const isFormValid = formData.firstname && formData.lastname && formData.email && formData.password && 
        (formData.role === 'SUPER_ADMIN' || (formData.role === 'ADMIN' && formData.cityIds.length > 0));

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un admin">
            <div className="p-6">
                {/* Profile Picture Upload */}
                <div className="flex justify-center mb-6">
                    <ProfilePictureUpload
                        onImageSelect={handleProfilePictureSelect}
                        size="md"
                        disabled={isLoading}
                    />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    {/* Name and First Name */}
                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            placeholder="Nom"
                            value={formData.lastname}
                            onChange={(value) => setFormData(prev => ({ ...prev, lastname: value }))}
                            required
                            disabled={isLoading}
                        />
                        <TextInput
                            placeholder="Prénom"
                            value={formData.firstname}
                            onChange={(value) => setFormData(prev => ({ ...prev, firstname: value }))}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email */}
                    <TextInput
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                        required
                        disabled={isLoading}
                    />

                    {/* Password */}
                    <TextInput
                        type="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                        required
                        disabled={isLoading}
                    />

                    {/* Role Selection */}
                    <div>
                        <p className="mb-3 text-sm text-gray-600">Sélectionnez un rôle</p>
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, role: 'ADMIN' }))}
                                disabled={isLoading}
                                className={`px-3 py-2 text-xs rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${formData.role === 'ADMIN'
                                        ? 'bg-[#23B2A4] text-white border-[#23B2A4]'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ 
                                    ...prev, 
                                    role: 'SUPER_ADMIN',
                                    cityIds: [] // Clear cities when switching to SUPER_ADMIN
                                }))}
                                disabled={isLoading}
                                className={`px-3 py-2 text-xs rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${formData.role === 'SUPER_ADMIN'
                                        ? 'bg-[#23B2A4] text-white border-[#23B2A4]'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                Super
                            </button>
                        </div>
                    </div>

                    {/* Cities Selection - Only show for ADMIN role */}
                    {formData.role === 'ADMIN' && (
                        <MultiSelectDropdown
                            options={cities.map(city => ({
                                value: city.id,
                                label: city.nom
                            }))}
                            selectedValues={formData.cityIds}
                            onChange={(values) => setFormData(prev => ({ 
                                ...prev, 
                                cityIds: values as number[] 
                            }))}
                            placeholder={loadingCities ? "Chargement des villes..." : "Sélectionnez des villes"}
                            searchPlaceholder="Rechercher une ville..."
                            label="Villes à administrer"
                            disabled={isLoading || loadingCities}
                            required={formData.role === 'ADMIN'}
                        />
                    )}

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
                                'Ajouter admin'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddAdminModal;
export type { AdminFormData };
