import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import AddCityModal from './AddCityModal';

interface City {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
  rayon: number;
  adminId?: number;
  admin?: {
    id: number;
    firstname: string;
    lastname: string;
  };
  pois?: any[];
}

const mockCities: City[] = [
  { id: 1, name: 'Paris', country: 'France', poisCount: 45, status: 'active', coordinates: { latitude: 48.8566, longitude: 2.3522 } },
  { id: 2, name: 'New York', country: 'USA', poisCount: 67, status: 'active', coordinates: { latitude: 40.7128, longitude: -74.0060 } },
  { id: 3, name: 'Tokyo', country: 'Japan', poisCount: 32, status: 'active', coordinates: { latitude: 35.6762, longitude: 139.6503 } },
  { id: 4, name: 'London', country: 'UK', poisCount: 28, status: 'inactive', coordinates: { latitude: 51.5074, longitude: -0.1278 } },
  { id: 5, name: 'Berlin', country: 'Germany', poisCount: 19, status: 'active', coordinates: { latitude: 52.5200, longitude: 13.4050 } },
];

const CitiesContent: React.FC = () => {
  const [cities, setCities] = useState<City[]>(mockCities);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter cities based on search term and status
  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || city.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCity = (cityData: Omit<City, 'id' | 'poisCount'>) => {
    const newCity: City = {
      ...cityData,
      id: Math.max(...cities.map(c => c.id)) + 1,
      poisCount: 0,
    };
    setCities([...cities, newCity]);
    setIsAddModalOpen(false);
  };

  const handleDeleteCity = (cityId: number) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      setCities(cities.filter(city => city.id !== cityId));
    }
  };

  const handleToggleStatus = (cityId: number) => {
    setCities(cities.map(city => 
      city.id === cityId 
        ? { ...city, status: city.status === 'active' ? 'inactive' : 'active' }
        : city
    ));
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Cities Management</h2>
        <p className="text-gray-600">Manage and view all cities in the system.</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="block px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Add City Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add New City</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Cities ({filteredCities.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordinates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  POIs Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No cities found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {city.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {city.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {city.coordinates ? 
                        `${city.coordinates.latitude.toFixed(4)}, ${city.coordinates.longitude.toFixed(4)}` 
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {city.poisCount} POIs
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(city.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                          city.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {city.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          title="View Details"
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          title="Edit City"
                          className="text-primary hover:text-primary-light transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete City"
                          onClick={() => handleDeleteCity(city.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add City Modal */}
      <AddCityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCity}
      />
    </>
  );
};

export default CitiesContent;
