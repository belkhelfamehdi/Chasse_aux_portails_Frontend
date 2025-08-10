import { useEffect, useState } from 'react';
import Modal from './Modal';
import { TextInput, TextArea, Dropdown } from '../inputs';
import Loading from '../Loading';
import type { POIData } from '../../services/api';
import { citiesAPI } from '../../services/api';

interface POI {
  id: number;
  nom: string;
  description: string;
  latitude: number;
  longitude: number;
  iconUrl?: string;
  modelUrl?: string;
  cityId: number;
}

interface City { id: number; nom: string; }

interface EditPOIModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPOI: POI | null;
  onSubmit: (data: Partial<POIData>) => void | Promise<void>;
  isLoading?: boolean;
}

const EditPOIModal: React.FC<EditPOIModalProps> = ({ isOpen, onClose, initialPOI, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    latitude: '',
    longitude: '',
    cityId: 0
  });
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (isOpen) {
      citiesAPI.getAll().then((res) => setCities(res as City[])).catch(() => setCities([]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialPOI) {
      setFormData({
        nom: initialPOI.nom ?? '',
        description: initialPOI.description ?? '',
        latitude: initialPOI.latitude?.toString() ?? '',
        longitude: initialPOI.longitude?.toString() ?? '',
        cityId: initialPOI.cityId ?? 0
      });
    }
  }, [isOpen, initialPOI]);

  const handleSubmit = async () => {
    const update: Partial<POIData> = {
      ...(formData.nom && { nom: formData.nom }),
      ...(formData.description && { description: formData.description }),
      ...(formData.latitude !== '' && { latitude: parseFloat(formData.latitude) }),
      ...(formData.longitude !== '' && { longitude: parseFloat(formData.longitude) }),
      ...(formData.cityId > 0 && { cityId: formData.cityId }),
    };
    await onSubmit(update);
  };

  if (!isOpen || !initialPOI) return null;

  const isFormValid = !!formData.nom && formData.latitude !== '' && formData.longitude !== '' && formData.cityId > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Modifier le POI: ${initialPOI.nom}`}>
      <div className="p-6 space-y-4">
        <TextInput
          placeholder="Nom du POI"
          value={formData.nom}
          onChange={(value) => setFormData(prev => ({ ...prev, nom: value }))}
          required
          disabled={isLoading}
        />
        <TextArea
          placeholder="Description du POI"
          value={formData.description}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          rows={3}
          disabled={isLoading}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextInput type="number" placeholder="Latitude" value={formData.latitude} onChange={(v) => setFormData(p => ({...p, latitude: v}))} required disabled={isLoading} />
          <TextInput type="number" placeholder="Longitude" value={formData.longitude} onChange={(v) => setFormData(p => ({...p, longitude: v}))} required disabled={isLoading} />
        </div>
        <Dropdown
          options={[{ value: '', label: 'Sélectionnez une ville' }, ...cities.map(c => ({ value: c.id.toString(), label: c.nom }))]}
          value={formData.cityId.toString()}
          onChange={(v) => setFormData(p => ({ ...p, cityId: parseInt(v) || 0 }))}
          placeholder={'Sélectionnez une ville'}
          label="Ville"
          required
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
            {isLoading ? (<><Loading size="sm" /><span className="ml-2">Saving...</span></>) : 'Enregistrer'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPOIModal;
