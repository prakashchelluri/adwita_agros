'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface ServiceRequest {
  id: number;
  requestNumber: string;
  customerName: string;
  vehicleModel: string;
  status: string;
  priority: string;
  assignedTechnician: string;
  createdAt: string;
}

interface Technician {
  id: number;
  username: string;
  email: string;
  activeJobs: number;
  completedToday: number;
}

export default function SupervisorDashboard() {
  const { user, isLoading, isAuthenticated, isHydrated } = useAuth();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingAssignment: 0,
    inProgress: 0,
    completedToday: 0,
    activeTechnicians: 0,
    avgCompletionTime: 0
  });

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
    if (!isAuthenticated || !user || user.role.toLowerCase() !== 'supervisor') {
      console.log('Supervisor access denied, redirecting to login');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    // Fetch supervisor dashboard data
    fetchDashboardData();
  }, [isAuthenticated, user, isLoading, isHydrated]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Fetch service requests
      const requestsResponse = await fetch('http://localhost:3001/service-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        setServiceRequests(requests.slice(0, 10)); // Show latest 10 requests
        
        // Calculate stats
        const pending = requests.filter((r: ServiceRequest) => r.status === 'PENDING').length;
        const inProgress = requests.filter((r: ServiceRequest) => r.status === 'IN_PROGRESS').length;
        const completedToday = requests.filter((r: ServiceRequest) => {
          const today = new Date().toDateString();
          return r.status === 'COMPLETED' && new Date(r.createdAt).toDateString() === today;
        }).length;

        setStats(prev => ({
          ...prev,
          totalRequests: requests.length,
          pendingAssignment: pending,
          inProgress: inProgress,
          completedToday: completedToday
        }));
      }

      // Fetch technicians (mock data for now)
      const mockTechnicians: Technician[] = [
        { id: 1, username: 'tech1', email: 'tech1@example.com', activeJobs: 3, completedToday: 2 },
        { id: 2, username: 'tech2', email: 'tech2@example.com', activeJobs: 2, completedToday: 4 },
        { id: 3, username: 'tech3', email: 'tech3@example.com', activeJobs: 1, completedToday: 1 },
      ];
      setTechnicians(mockTechnicians);
      
      setStats(prev => ({
        ...prev,
        activeTechnicians: mockTechnicians.filter(t => t.activeJobs > 0).length,
        avgCompletionTime: 2.5 // hours
      }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

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
  if (!isAuthenticated || !user || user.role.toLowerCase() !== 'supervisor') {
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📋</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalRequests}</dd>
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
                    <span className="text-white text-sm font-medium">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Assignment</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingAssignment}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🔧</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.inProgress}</dd>
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
                    <span className="text-white text-sm font-medium">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed Today</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.completedToday}</dd>
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
                    <span className="text-white text-sm font-medium">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Technicians</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeTechnicians}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⏱️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Completion</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.avgCompletionTime}h</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Assign Technician
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Review Completed Jobs
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Technician Performance
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Generate Reports
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Service Requests */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Service Requests</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serviceRequests.length > 0 ? (
                      serviceRequests.slice(0, 5).map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.requestNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={getPriorityColor(request.priority)}>
                              {request.priority}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          No service requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Technician Performance */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Technician Performance</h3>
              <div className="space-y-4">
                {technicians.map((technician) => (
                  <div key={technician.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{technician.username}</h4>
                      <p className="text-sm text-gray-500">{technician.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Active: {technician.activeJobs}
                      </div>
                      <div className="text-sm text-gray-500">
                        Completed Today: {technician.completedToday}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}