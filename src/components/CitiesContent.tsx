import React from 'react';

const CitiesContent: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Cities Management</h2>
        <p className="text-gray-600">Manage and view all cities in the system.</p>
      </div>

      {/* Cities Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">All Cities</h3>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors">
            Add New City
          </button>
        </div>
        
        {/* Example cities table */}
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Paris
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  France
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  45
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary-light">Edit</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  New York
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  USA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  67
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary-light">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CitiesContent;
