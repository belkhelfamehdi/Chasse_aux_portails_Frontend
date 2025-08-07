import React from 'react';
import Layout from '../../components/Layout';
import POIsContent from '../../components/contents/POIsContent';

const POIsPage: React.FC = () => {
  return (
    <Layout title="Gestion des POIs" subtitle="Gérez tous les points d'intérêt">
      <POIsContent />
    </Layout>
  );
};

export default POIsPage;
