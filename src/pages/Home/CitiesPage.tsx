import React from 'react';
import Layout from '../../components/Layout';
import CitiesContent from '../../components/CitiesContent';

const CitiesPage: React.FC = () => {
  return (
    <Layout title="Gestion des villes" subtitle="Gérez les villes et leurs zones">
      <CitiesContent />
    </Layout>
  );
};

export default CitiesPage;
