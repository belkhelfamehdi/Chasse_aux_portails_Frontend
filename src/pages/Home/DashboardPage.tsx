import React from 'react';
import Layout from '../../components/Layout';
import DashboardContent from '../../components/contents/DashboardContent';

const DashboardPage: React.FC = () => {
  return (
    <Layout title="Chasse aux portails" subtitle="Welcome back">
      <DashboardContent />
    </Layout>
  );
};

export default DashboardPage;
