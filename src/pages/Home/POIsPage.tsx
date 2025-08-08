import React from 'react';
import Layout from '../../components/Layout';
import POIsContent from '../../components/contents/POIsContent';

const POIsPage: React.FC = () => {
  return (
    <Layout title="Gestion des POIs">
      <POIsContent />
    </Layout>
  );
};

export default POIsPage;
