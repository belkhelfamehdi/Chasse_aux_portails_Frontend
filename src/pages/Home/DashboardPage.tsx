import React from 'react';
import Layout from '../../components/Layout';
import DashboardContent from '../../components/contents/DashboardContent';

const DashboardPage: React.FC = () => {
  return (
    <Layout title="Chasse aux portails">
      <DashboardContent />
    </Layout>
  );
};

export default DashboardPage;
