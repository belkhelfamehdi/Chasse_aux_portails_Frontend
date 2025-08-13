import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CityDetailsContent from '../../components/contents/CityDetailsContent';

const CityDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    if (!id) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center gap-4">
                <h2 className="text-2xl font-bold text-red-500">Erreur</h2>
                <p className="text-gray-500">ID de ville manquant</p>
                <button
                    onClick={handleBack}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded font-medium flex items-center gap-2 transition-colors"
                >
                    ← Retour
                </button>
            </div>
        );
    }

    return <CityDetailsContent cityId={id} />;
};

export default CityDetailsPage;
