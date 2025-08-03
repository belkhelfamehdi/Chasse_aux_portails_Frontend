import React, { useState } from 'react';
import {
    Modal,
    TextInput,
    Dropdown,
    Button,
    type DropdownOption
} from './inputs/index';

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
        role: 'ADMIN'
    });

    const roleOptions: DropdownOption[] = [
        { value: 'SUPER_ADMIN', label: 'Super Administrateur' },
        { value: 'ADMIN', label: 'Administrateur' }
    ];

    const handleSubmit = () => {
        const adminData: AdminFormData = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            role: formData.role as AdminFormData['role']
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajouter un administrateur"
        >
            <div className="p-6 space-y-4">
                {/* First Name */}
                <TextInput
                    placeholder="Prénom"
                    value={formData.firstname}
                    onChange={(value) => setFormData(prev => ({ ...prev, firstname: value }))}
                />

                {/* Last Name */}
                <TextInput
                    placeholder="Nom"
                    value={formData.lastname}
                    onChange={(value) => setFormData(prev => ({ ...prev, lastname: value }))}
                />

                {/* Email */}
                <TextInput
                    type="email"
                    placeholder="Adresse e-mail"
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

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        label="Annuler"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    />
                    <Button
                        label="Ajouter admin"
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

export default AddAdminModal;
export type { AdminFormData };
