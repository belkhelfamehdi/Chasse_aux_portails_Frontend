import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        role: 'ADMIN' as 'SUPER_ADMIN' | 'ADMIN'
    });

    const handleSubmit = () => {
        const adminData: AdminFormData = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            role: formData.role
        };

        onSubmit(adminData);
        
        // Reset form
        setFormData({
            firstname: '',
            lastname: '',
            email: '',
            role: 'ADMIN'
        });
        onClose();
    };

    const isFormValid = formData.firstname && formData.lastname && formData.email;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4" style={{ backgroundColor: 'white' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200" style={{ backgroundColor: 'white' }}>
                    <h2 className="text-lg font-semibold" style={{ color: '#1f2937' }}>Ajouter un admin</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6" style={{ backgroundColor: 'white' }}>
                    {/* Profile Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                            <span className="text-2xl">👤</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Name and First Name */}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Nom"
                                value={formData.lastname}
                                onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
                                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                                style={{ 
                                    borderColor: '#e5e7eb', 
                                    backgroundColor: 'white',
                                    color: '#1f2937'
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Prénom"
                                value={formData.firstname}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
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

                        {/* Role Selection */}
                        <div>
                            <p className="text-sm text-gray-600 mb-3">Sélectionnez un rôle</p>
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'ADMIN' }))}
                                    className={`px-3 py-2 text-xs rounded-full border transition-colors ${
                                        formData.role === 'ADMIN'
                                            ? 'bg-[#23B2A4] text-white border-[#23B2A4]'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'SUPER_ADMIN' }))}
                                    className={`px-3 py-2 text-xs rounded-full border transition-colors ${
                                        formData.role === 'SUPER_ADMIN'
                                            ? 'bg-[#23B2A4] text-white border-[#23B2A4]'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    Super
                                </button>
                                <button
                                    type="button"
                                    className="px-3 py-2 text-xs rounded-full border bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                >
                                    Agent
                                </button>
                                <button
                                    type="button"
                                    className="px-3 py-2 text-xs rounded-full border bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                >
                                    Visiteur
                                </button>
                            </div>
                        </div>

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

export default AddAdminModal;
export type { AdminFormData };
