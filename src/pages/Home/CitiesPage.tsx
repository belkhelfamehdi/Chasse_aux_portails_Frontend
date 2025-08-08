import React from 'react';
import Layout from '../../components/Layout';
import CitiesContent from '../../components/contents/CitiesContent';

const CitiesPage: React.FC = () => {
  return (
    <Layout title="Gestion des Villes">
      <CitiesContent />
    </Layout>
  );
};

export default CitiesPage;
