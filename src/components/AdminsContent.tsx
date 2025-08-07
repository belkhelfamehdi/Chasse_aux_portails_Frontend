import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AddAdminModal from './modals/AddAdminModal';

interface Admin {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  cities?: City[];
}

interface City {
  id: string;
  nom: string;
}

interface AdminFormData {
  firstname: string;
  lastname: string;
  email: string;
  role: Admin['role'];
}

// Mock data
const mockAdmins: Admin[] = [
  {
    id: '1',
    firstname: 'Grand Plaza',
    lastname: 'Fountain',
    email: 'example@email.com',
    role: 'ADMIN',
    cities: []
  },
  {
    id: '2',
    firstname: 'Apex',
    lastname: 'Tower',
    email: 'example@email.com',
    role: 'ADMIN',
    cities: []
  },
  {
    id: '3',
    firstname: 'Bright',
    lastname: 'Square',
    email: 'example@email.com',
    role: 'ADMIN',
    cities: []
  },
  {
    id: '4',
    firstname: 'National Museum',
    lastname: 'of Art',
    email: 'example@email.com',
    role: 'ADMIN',
    cities: []
  },
  {
    id: '5',
    firstname: 'Liberty',
    lastname: 'Bridge',
    email: 'example@email.com',
    role: 'ADMIN',
    cities: []
  }
];

export default function AdminsContent() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddAdmin = (adminData: AdminFormData) => {
    const newAdmin: Admin = {
      id: (Math.max(...admins.map(a => parseInt(a.id))) + 1).toString(),
      ...adminData,
      cities: []
    };
    setAdmins([...admins, newAdmin]);
    setIsAddModalOpen(false);
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      setAdmins(admins.filter(admin => admin.id !== adminId));
    }
  };

  const getFullName = (firstname: string, lastname: string) => {
    return `${firstname} ${lastname}`;
  };

  const getProfileIcon = (name: string) => {
    // Simple icon mapping for demo - matching the UI design icons
    const iconMap: { [key: string]: string } = {
      'Grand Plaza Fountain': '🏛️',
      'Apex Tower': '🏢',
      'Bright Square': '📍', 
      'National Museum of Art': '🏛️',
      'Liberty Bridge': '🌉'
    };
    
    return iconMap[name] || '👤';
  };

  const filteredAdmins = admins.filter(admin => {
    const fullName = getFullName(admin.firstname, admin.lastname);
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
          <p className="text-sm text-primary">Gérer les admins</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Ajouter un admin
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Recherchez un administrateur"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
          />
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
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
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">
                            {getProfileIcon(getFullName(admin.firstname, admin.lastname))}
                          </span>
                        </div>
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
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span className="text-sm">Edit</span>
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        title="Supprimer"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <span className="text-sm">Delete</span>
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
      />
    </div>
  );
}
