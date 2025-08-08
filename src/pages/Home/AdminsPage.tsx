import React from 'react';
import Layout from '../../components/Layout';
import AdminsContent from '../../components/contents/AdminsContent';

const AdminsPage: React.FC = () => {
  return (
    <Layout title="Gestion des Admins">
      <AdminsContent />
    </Layout>
  );
};

export default AdminsPage;
