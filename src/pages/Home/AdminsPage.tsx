import React from 'react';
import Layout from '../../components/Layout';
import AdminsContent from '../../components/AdminsContent';

const AdminsPage: React.FC = () => {
  return (
    <Layout title="Gestion des Admins" subtitle="Gérez tous les administrateurs">
      <AdminsContent />
    </Layout>
  );
};

export default AdminsPage;
