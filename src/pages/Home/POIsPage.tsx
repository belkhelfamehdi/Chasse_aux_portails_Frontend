import React from 'react';
import Layout from '../../components/Layout';
import POIsContent from '../../components/POIsContent';

interface POIsPageProps {
    onLogout?: () => void;
}

const POIsPage: React.FC<POIsPageProps> = ({ onLogout }) => {
    return (
        <Layout title="Gestion des POIs" subtitle="Points d'intérêt dans les villes" onLogout={onLogout}>
            <POIsContent />
        </Layout>
    );
};

export default POIsPage;
