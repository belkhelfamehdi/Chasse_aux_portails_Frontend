import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { adminsAPI, type AdminData } from '../../services/api';
import AddAdminModal from '../modals/AddAdminModal';
import EditAdminModal from '../modals/EditAdminModal';
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

  const handleDeleteAdmin = async (adminId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      try {
        setIsDeleting(adminId);
        await adminsAPI.delete(parseInt(adminId));
        await loadAdmins(); // Reload the list to get fresh data
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Erreur lors de la suppression de l\'administrateur. Veuillez réessayer.');
      } finally {
        setIsDeleting(null);
      }
    }
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
        <Loading size="lg" message="Loading admins..." className="min-h-96" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
          <p className="text-sm text-primary">Gérer les admins</p>
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
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
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
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
        <table className="min-w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Nom
              </th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-sm font-medium text-right text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
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
                        className="text-link font-semibold transition-colors hover:text-blue-800"
                        onClick={() => openEditAdmin(admin)}
                      >
                        <span className="text-sm">Edit</span>
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        title="Supprimer"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        disabled={isDeleting === admin.id}
                        className="text-link font-semibold transition-colors hover:text-red-800 disabled:opacity-50"
                      >
                        {isDeleting === admin.id ? (
                          <Loading size="sm" />
                        ) : (
                          <span className="text-sm">Delete</span>
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
    </div>
  );
}
