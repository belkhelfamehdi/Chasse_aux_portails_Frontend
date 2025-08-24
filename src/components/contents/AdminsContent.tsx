import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { adminsAPI, type AdminData } from '../../services/api';
import AddAdminModal from '../modals/AddAdminModal';
import EditAdminModal from '../modals/EditAdminModal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import Button from '../Button';
import Loading from '../Loading';

interface Admin {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  cities?: City[];
  profilePictureUrl?: string;
}

interface City {
  id: string;
  nom: string;
}

interface AdminFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Admin['role'];
  cityIds: number[];
  profilePicture?: File | null;
}

export default function AdminsContent() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);

  // Load admins on component mount
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await adminsAPI.getAll();
      setAdmins(response as Admin[]);
    } catch (error) {
      console.error('Error loading admins:', error);
      // Initialize empty array on error - user will see "no admins found" message
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (adminData: AdminFormData) => {
    try {
      setIsSubmitting(true);
      await adminsAPI.create(adminData);
      await loadAdmins(); // Reload the list to get fresh data
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding admin:', error);
      // Show error message to user instead of fallback data
      alert('Erreur lors de l\'ajout de l\'administrateur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    setAdminToDelete(admin);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;

    try {
      setIsDeleting(adminToDelete.id);
      await adminsAPI.delete(parseInt(adminToDelete.id));
      await loadAdmins(); // Reload the list to get fresh data
      
      // Close modal and reset
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Erreur lors de la suppression de l\'administrateur. Veuillez réessayer.');
    } finally {
      setIsDeleting(null);
    }
  };

  const cancelDeleteAdmin = () => {
    setIsDeleteModalOpen(false);
    setAdminToDelete(null);
  };

  const openEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleEditAdmin = async (data: Partial<AdminData>) => {
    if (!editingAdmin) return;
    try {
      setIsSubmitting(true);
      await adminsAPI.update(parseInt(editingAdmin.id), data);
      await loadAdmins();
      setIsEditModalOpen(false);
      setEditingAdmin(null);
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Erreur lors de la mise à jour de l\'administrateur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFullName = (firstname: string, lastname: string) => {
    return `${firstname} ${lastname}`;
  };

  const getInitials = (firstname: string, lastname: string, email: string) => {
    const a = firstname?.[0]?.toUpperCase();
    const b = lastname?.[0]?.toUpperCase();
    if (a || b) return `${a || ''}${b || ''}` || undefined;
    return email?.[0]?.toUpperCase() || 'U';
  };

  const filteredAdmins = admins.filter(admin => {
    const fullName = getFullName(admin.firstname, admin.lastname);
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading size="lg" message="Chargement des administrateurs..." className="min-h-96" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ynov-primary font-montserrat">Administrateurs</h1>
          <p className="text-sm text-ynov-secondary font-source-sans">Gérer les administrateurs</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-full">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
          <input
            type="text"
            placeholder="Recherchez un administrateur"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl focus:border-transparent font-source-sans"
          />
          </div>
        </div>
        <Button
          label="Ajouter un admin"
          onClick={() => setIsAddModalOpen(true)}
          className="min-w-fit "
        />
      </div>

      {/* Admin Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-left text-ynov-primary font-source-sans">
                Nom
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-ynov-primary font-source-sans">
                Email
              </th>
              <th className="px-6 py-3 text-sm font-medium text-right text-ynov-primary font-source-sans">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500 font-source-sans">
                  Aucun administrateur trouvé.
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {admin.profilePictureUrl ? (
                          <img
                            src={admin.profilePictureUrl}
                            alt={`Avatar de ${getFullName(admin.firstname, admin.lastname)}`}
                            className="object-cover w-10 h-10 rounded-full"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                            <span className="text-sm font-medium text-gray-600">
                              {getInitials(admin.firstname, admin.lastname, admin.email)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getFullName(admin.firstname, admin.lastname)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        title="Modifier"
                        className="text-link font-semibold transition-colors cursor-pointer"
                        onClick={() => openEditAdmin(admin)}
                      >
                        <span className="text-sm">Modifier</span>
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        title="Supprimer"
                        onClick={() => handleDeleteAdmin(admin)}
                        disabled={isDeleting === admin.id}
                        className="text-link font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isDeleting === admin.id ? (
                          <Loading size="sm" />
                        ) : (
                          <span className="text-sm">Supprimer</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAdmin}
        isLoading={isSubmitting}
      />

      {/* Edit Admin Modal */}
      <EditAdminModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingAdmin(null); }}
        initialAdmin={editingAdmin}
        onSubmit={handleEditAdmin}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteAdmin}
        onConfirm={confirmDeleteAdmin}
        title="Supprimer l'administrateur"
        message={`Êtes-vous sûr de vouloir supprimer l'administrateur ${adminToDelete ? (adminToDelete.firstname + ' ' + adminToDelete.lastname) : ''} ? Cette action est irréversible.`}
        itemName={adminToDelete ? `${adminToDelete.firstname} ${adminToDelete.lastname}` : ''}
        isDeleting={isDeleting === adminToDelete?.id}
      />
    </div>
  );
}
