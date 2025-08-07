import React from 'react';
import Layout from '../../components/Layout';
import CitiesContent from '../../components/CitiesContent';

const CitiesPage: React.FC = () => {
  return (
    <Layout title="Gestion des Villes" subtitle="Gérez toutes les villes de votre système">
      <CitiesContent />
    </Layout>
  );
};

export default CitiesPage;
