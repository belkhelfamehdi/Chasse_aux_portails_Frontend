import React from 'react';
import { MapPinIcon, UsersIcon, MapIcon } from '@heroicons/react/24/outline';

// Mock data for the dashboard
const mockStats = {
  totalCities: 150,
  totalPOIs: 2350,
  admins: 875
};

const mockRecentActivities = [
  {
    id: 1,
    user: {
      name: 'Emily Carter',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b563?w=40&h=40&fit=crop&crop=face'
    },
    action: 'Emily has object submitted and is for your Central Park',
    time: '2 hours ago'
  },
  {
    id: 2,
    user: {
      name: 'David Lee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    action: 'David has new activities - Admin',
    time: '3 hours ago'
  },
  {
    id: 3,
    user: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    action: 'Sarah has user submissions for San Francisco',
    time: '5 hours ago'
  }
];

const mockActiveAdmins = [
  { id: 1, name: 'Emily Carter', lastActive: '2 days ago' },
  { id: 2, name: 'David Lee', lastActive: '1 week ago' },
  { id: 3, name: 'Sarah Chen', lastActive: '4 days ago' },
  { id: 4, name: 'Michael Brown', lastActive: '3 days ago' }
];

const DashboardContent: React.FC = () => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                <MapIcon className="h-auto w-7 text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cities</p>
              <p className="text-xl font-semibold text-gray-900">{mockStats.totalCities}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                <MapPinIcon className="h-auto w-7 text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total POIs</p>
              <p className="text-xl font-semibold text-gray-900">{mockStats.totalPOIs.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                <UsersIcon className="h-auto w-7 text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Admins</p>
              <p className="text-xl font-semibold text-gray-900">{mockStats.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Activités récentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockRecentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="flex-shrink-0 w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user.name}</span>
                    </p>
                    <p className="mt-1 text-sm font-light text-primary">{activity.action}</p>
                    <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Admins */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Active Admins</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-500 border-gray-200 font-mediumborder-b">
                <span>Admin Name</span>
                <span>Last Active</span>
              </div>
              {mockActiveAdmins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-900">{admin.name}</span>
                  <span className="text-sm text-primary">{admin.lastActive}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
