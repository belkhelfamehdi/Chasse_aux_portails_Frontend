import React, { useState } from 'react';
import { ProfilePictureUpload, TextInput } from '../inputs';
import Modal from './Modal';

interface AddAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AdminFormData) => void;
}

interface AdminFormData {
    firstname: string;
    lastname: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    profilePicture?: File | null;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        role: 'ADMIN' as 'SUPER_ADMIN' | 'ADMIN'
    });

    const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null);

    const handleProfilePictureSelect = (file: File | null) => {
        setSelectedProfilePicture(file);
    };

    const handleSubmit = () => {
        const adminData: AdminFormData = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            role: formData.role,
            profilePicture: selectedProfilePicture
        };

        onSubmit(adminData);

        // Reset form
        setFormData({
            firstname: '',
            lastname: '',
            email: '',
            role: 'ADMIN'
        });
        setSelectedProfilePicture(null);
        onClose();
    };

    const isFormValid = formData.firstname && formData.lastname && formData.email;

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un admin">
            <div className="p-6">
                {/* Profile Picture Upload */}
                <div className="flex justify-center mb-6">
                    <ProfilePictureUpload
                        onImageSelect={handleProfilePictureSelect}
                        size="md"
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
                        />
                        <TextInput
                            placeholder="Prénom"
                            value={formData.firstname}
                            onChange={(value) => setFormData(prev => ({ ...prev, firstname: value }))}
                            required
                        />
                    </div>

                    {/* Email */}
                    <TextInput
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                        required
                    />

                    {/* Role Selection */}
                    <div>
                        <p className="mb-3 text-sm text-gray-600">Sélectionnez un rôle</p>
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, role: 'ADMIN' }))}
                                className={`px-3 py-2 text-xs rounded-full border transition-colors ${formData.role === 'ADMIN'
                                        ? 'bg-[#23B2A4] text-white border-[#23B2A4]'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, role: 'SUPER_ADMIN' }))}
                                className={`px-3 py-2 text-xs rounded-full border transition-colors ${formData.role === 'SUPER_ADMIN'
                                        ? 'bg-[#23B2A4] text-white border-[#23B2A4]'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                Super
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className="w-full py-3 font-medium transition-colors rounded-lg"
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
        </Modal>
    );
};

export default AddAdminModal;
export type { AdminFormData };
