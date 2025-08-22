import React, { useEffect, useState } from 'react';
import { ProfilePictureUpload, TextInput, MultiSelectDropdown } from '../inputs';
import Modal from './Modal';
import Loading from '../Loading';
import { citiesAPI, type AdminData } from '../../services/api';

interface City { id: number; nom: string; }

interface Admin {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  cities?: Array<{ id: string | number; nom: string }>;
  profilePictureUrl?: string;
}

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAdmin: Admin | null;
  onSubmit: (data: Partial<AdminData>) => void | Promise<void>;
  isLoading?: boolean;
}

const EditAdminModal: React.FC<EditAdminModalProps> = ({ isOpen, onClose, initialAdmin, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'ADMIN' as 'SUPER_ADMIN' | 'ADMIN',
    cityIds: [] as number[],
  });
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (isOpen) {
      citiesAPI.getAll().then((res) => setCities(res as City[])).catch(() => setCities([]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialAdmin) {
      setFormData({
        firstname: initialAdmin.firstname ?? '',
        lastname: initialAdmin.lastname ?? '',
        email: initialAdmin.email ?? '',
        password: '',
        role: initialAdmin.role,
        cityIds: initialAdmin.cities?.map(c => Number(c.id)) ?? [],
      });
      setPreview(initialAdmin.profilePictureUrl);
      setSelectedProfilePicture(null);
    }
  }, [isOpen, initialAdmin]);

  const handleProfilePictureSelect = (file: File | null) => {
    setSelectedProfilePicture(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(initialAdmin?.profilePictureUrl);
  };

  const handleSubmit = async () => {
    const update: Partial<AdminData> = {
      ...(formData.firstname && { firstname: formData.firstname }),
      ...(formData.lastname && { lastname: formData.lastname }),
      ...(formData.email && { email: formData.email }),
      ...(formData.password && { password: formData.password }),
      ...(formData.role && { role: formData.role }),
      ...(formData.cityIds && { cityIds: formData.cityIds }),
      ...(selectedProfilePicture !== null && { profilePicture: selectedProfilePicture }),
    };
    await onSubmit(update);
  };

  if (!isOpen || !initialAdmin) return null;

  const isFormValid = !!formData.firstname && !!formData.lastname && !!formData.email;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Modifier l'admin: ${initialAdmin.firstname} ${initialAdmin.lastname}`}>
      <div className="p-6">
        <div className="flex justify-center mb-6">
          <ProfilePictureUpload
            onImageSelect={handleProfilePictureSelect}
            size="md"
            disabled={isLoading}
            currentImage={preview}
          />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <TextInput placeholder="Nom" value={formData.lastname} onChange={(v) => setFormData(p => ({...p, lastname: v}))} required disabled={isLoading} />
            <TextInput placeholder="Prénom" value={formData.firstname} onChange={(v) => setFormData(p => ({...p, firstname: v}))} required disabled={isLoading} />
          </div>
          <TextInput type="email" placeholder="Email" value={formData.email} onChange={(v) => setFormData(p => ({...p, email: v}))} required disabled={isLoading} />
          <TextInput type="password" placeholder="Nouveau mot de passe (optionnel)" value={formData.password} onChange={(v) => setFormData(p => ({...p, password: v}))} disabled={isLoading} />

          {formData.role === 'ADMIN' && (
            <MultiSelectDropdown
              options={cities.map(c => ({ value: c.id, label: c.nom }))}
              selectedValues={formData.cityIds}
              onChange={(values) => setFormData(p => ({ ...p, cityIds: values as number[] }))}
              placeholder={'Sélectionnez des villes'}
              searchPlaceholder="Rechercher une ville..."
              label="Villes à administrer"
              disabled={isLoading}
              required
            />
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="flex items-center justify-center px-4 py-2 font-normal transition-colors rounded-lg"
              style={{ backgroundColor: (isFormValid && !isLoading) ? '#23B2A4' : '#d1d5db', color: (isFormValid && !isLoading) ? 'white' : '#6b7280', cursor: (isFormValid && !isLoading) ? 'pointer' : 'not-allowed' }}
            >
              {isLoading ? (<><Loading size="sm" /><span className="ml-2">Enregistrement...</span></>) : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditAdminModal;
