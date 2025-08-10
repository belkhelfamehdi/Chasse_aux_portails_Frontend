import { useEffect, useState } from 'react';
import Modal from './Modal';
import { TextInput } from '../inputs';
import Loading from '../Loading';
import type { CityData } from '../../services/api';

interface City {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
  rayon: number;
  adminId?: number;
}

type CityFormData = Partial<Pick<CityData, 'nom' | 'latitude' | 'longitude' | 'rayon'>>;

interface EditCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCity: City | null;
  onSubmit: (data: Partial<CityData>) => void | Promise<void>;
  isLoading?: boolean;
}

const EditCityModal: React.FC<EditCityModalProps> = ({ isOpen, onClose, initialCity, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    nom: '',
    latitude: '',
    longitude: '',
    rayon: '',
  });

  useEffect(() => {
    if (isOpen && initialCity) {
      setFormData({
        nom: initialCity.nom ?? '',
        latitude: initialCity.latitude?.toString() ?? '',
        longitude: initialCity.longitude?.toString() ?? '',
        rayon: initialCity.rayon?.toString() ?? '',
      });
    }
  }, [isOpen, initialCity]);

  const handleSubmit = async () => {
    const update: CityFormData = {
      ...(formData.nom && { nom: formData.nom }),
      ...(formData.latitude !== '' && { latitude: parseFloat(formData.latitude) }),
      ...(formData.longitude !== '' && { longitude: parseFloat(formData.longitude) }),
      ...(formData.rayon !== '' && { rayon: parseInt(formData.rayon) }),
    };
    await onSubmit(update);
  };

  if (!isOpen || !initialCity) return null;

  const isFormValid = !!formData.nom && formData.latitude !== '' && formData.longitude !== '' && formData.rayon !== '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Modifier la ville: ${initialCity.nom}`}>
      <div className="p-6">
        <div className="space-y-4">
          <TextInput
            placeholder="Nom de la ville"
            value={formData.nom}
            onChange={(value) => setFormData(prev => ({ ...prev, nom: value }))}
            required
            disabled={isLoading}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              type="number"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={(value) => setFormData(prev => ({ ...prev, latitude: value }))}
              required
              disabled={isLoading}
            />
            <TextInput
              type="number"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={(value) => setFormData(prev => ({ ...prev, longitude: value }))}
              required
              disabled={isLoading}
            />
          </div>
          <TextInput
            type="number"
            placeholder="Rayon (km)"
            value={formData.rayon}
            onChange={(value) => setFormData(prev => ({ ...prev, rayon: value }))}
            required
            disabled={isLoading}
          />
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
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditCityModal;
