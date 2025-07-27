'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import DashboardNav from '@/components/DashboardNav';

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated, isHydrated, logout } = useAuth();

  useEffect(() => {
    // Only proceed after hydration is complete
    if (!isHydrated) {
      return;
    }

    // Wait for loading to complete
    if (isLoading) {
      return;
    }

    // Check authentication and role
    if (!isAuthenticated || !user || user.role.toLowerCase() !== 'admin') {
      console.log('Admin access denied, redirecting to login');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [isAuthenticated, user, isLoading, isHydrated]);

  // Show loading during hydration and auth check
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirecting state if not authorized
  if (!isAuthenticated || !user || user.role.toLowerCase() !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">SR</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Service Requests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">U</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">6</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">V</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Registered Vehicles
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">P</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Parts in Inventory
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="/admin/service-requests" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-sm font-medium text-center">
              View Service Requests
            </a>
            <a href="/admin/users" className="block bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-sm font-medium text-center">
              Manage Users
            </a>
            <a href="/admin/vehicles" className="block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-md text-sm font-medium text-center">
              Vehicle Management
            </a>
            <a href="/admin/inventory" className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md text-sm font-medium text-center">
              Inventory Management
            </a>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md text-sm font-medium">
              Reports & Analytics
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-md text-sm font-medium">
              System Settings
            </button>
          </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity to display.</p>
                <p className="text-sm mt-2">Service requests and system activities will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}