import React from 'react';
import Layout from '../../components/Layout';
import CitiesContent from '../../components/CitiesContent';

interface CitiesPageProps {
  onLogout?: () => void;
}

const CitiesPage: React.FC<CitiesPageProps> = ({ onLogout }) => {
  return (
    <Layout title="Gestion des villes" subtitle="Gérez les villes et leurs zones" onLogout={onLogout}>
      <CitiesContent />
    </Layout>
  );
};

export default CitiesPage;
