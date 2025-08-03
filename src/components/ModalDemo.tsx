import React, { useState } from 'react';
import {
    Button,
    AddPOIModal,
    AddCityModal,
    type POIFormData,
    type CityFormData
} from './inputs/index';

const ModalDemo: React.FC = () => {
    const [isPOIModalOpen, setIsPOIModalOpen] = useState(false);
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);

    const handlePOISubmit = (data: POIFormData) => {
        console.log('POI Form Data:', data);
        // Handle POI submission here
        alert(`POI "${data.name}" ajouté avec succès!`);
    };

    const handleCitySubmit = (data: CityFormData) => {
        console.log('City Form Data:', data);
        // Handle City submission here
        alert(`Ville "${data.name}" ajoutée avec succès!`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Chasse aux Portails - Modales
                </h1>
                
                <div className="flex space-x-4">
                    <Button
                        label="Ajouter POI"
                        onClick={() => setIsPOIModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-600"
                    />
                    
                    <Button
                        label="Ajouter une ville"
                        onClick={() => setIsCityModalOpen(true)}
                        className="bg-green-500 hover:bg-green-600"
                    />
                </div>

                {/* POI Modal */}
                <AddPOIModal
                    isOpen={isPOIModalOpen}
                    onClose={() => setIsPOIModalOpen(false)}
                    onSubmit={handlePOISubmit}
                />

                {/* City Modal */}
                <AddCityModal
                    isOpen={isCityModalOpen}
                    onClose={() => setIsCityModalOpen(false)}
                    onSubmit={handleCitySubmit}
                />
            </div>
        </div>
    );
};

export default ModalDemo;
