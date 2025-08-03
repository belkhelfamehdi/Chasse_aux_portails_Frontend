import React from 'react';
import Layout from '../../components/Layout';
import AdminsContent from '../../components/AdminsContent';

interface AdminsPageProps {
  onLogout?: () => void;
}

const AdminsPage: React.FC<AdminsPageProps> = ({ onLogout }) => {
  return (
    <Layout title="Admins" subtitle="Gestion des administrateurs" onLogout={onLogout}>
      <AdminsContent />
    </Layout>
  );
};

export default AdminsPage;
