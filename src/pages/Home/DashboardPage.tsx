import React from 'react';
import Layout from '../../components/Layout';
import DashboardContent from '../../components/DashboardContent';

interface DashboardPageProps {
  onLogout?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  return (
    <Layout title="Chasse aux portails" subtitle="Welcome back" onLogout={onLogout}>
      <DashboardContent />
    </Layout>
  );
};

export default DashboardPage;
