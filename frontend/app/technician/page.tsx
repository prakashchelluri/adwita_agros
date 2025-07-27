'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface JobSheet {
  id: number;
  serviceRequestId: number;
  requestNumber: string;
  customerName: string;
  vehicleModel: string;
  description: string;
  status: string;
  priority: string;
  estimatedHours: number;
  actualHours: number;
  createdAt: string;
}

interface TimeLog {
  id: number;
  jobSheetId: number;
  startTime: string;
  endTime: string | null;
  description: string;
  hoursLogged: number;
}

export default function TechnicianDashboard() {
  const { user, isLoading, isAuthenticated, isHydrated } = useAuth();
  const [jobSheets, setJobSheets] = useState<JobSheet[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [stats, setStats] = useState({
    assignedJobs: 0,
    inProgressJobs: 0,
    completedToday: 0,
    totalHoursToday: 0,
    pendingApproval: 0
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
    if (!isAuthenticated || !user || user.role.toLowerCase() !== 'technician') {
      console.log('Technician access denied, redirecting to login');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    // Fetch technician dashboard data
    fetchDashboardData();
  }, [isAuthenticated, user, isLoading, isHydrated]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Mock data for job sheets (in real app, fetch from API)
      const mockJobSheets: JobSheet[] = [
        {
          id: 1,
          serviceRequestId: 1,
          requestNumber: 'SR-001',
          customerName: 'John Doe',
          vehicleModel: 'Tractor Model X',
          description: 'Engine maintenance and oil change',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          estimatedHours: 4,
          actualHours: 2.5,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          serviceRequestId: 2,
          requestNumber: 'SR-002',
          customerName: 'Jane Smith',
          vehicleModel: 'Harvester Pro',
          description: 'Hydraulic system repair',
          status: 'ASSIGNED',
          priority: 'MEDIUM',
          estimatedHours: 6,
          actualHours: 0,
          createdAt: new Date().toISOString()
        }
      ];

      const mockTimeLogs: TimeLog[] = [
        {
          id: 1,
          jobSheetId: 1,
          startTime: '2024-01-15T09:00:00Z',
          endTime: '2024-01-15T11:30:00Z',
          description: 'Engine inspection and diagnosis',
          hoursLogged: 2.5
        }
      ];

      setJobSheets(mockJobSheets);
      setTimeLogs(mockTimeLogs);

      // Calculate stats
      const assigned = mockJobSheets.filter(j => j.status === 'ASSIGNED').length;
      const inProgress = mockJobSheets.filter(j => j.status === 'IN_PROGRESS').length;
      const completedToday = mockJobSheets.filter(j => {
        const today = new Date().toDateString();
        return j.status === 'COMPLETED' && new Date(j.createdAt).toDateString() === today;
      }).length;
      const totalHoursToday = mockTimeLogs.reduce((sum, log) => sum + log.hoursLogged, 0);

      setStats({
        assignedJobs: assigned,
        inProgressJobs: inProgress,
        completedToday: completedToday,
        totalHoursToday: totalHoursToday,
        pendingApproval: 1
      });

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

  const startTimer = (jobSheetId: number) => {
    setActiveTimer(jobSheetId);
    // In real app, make API call to start time tracking
    console.log(`Started timer for job sheet ${jobSheetId}`);
  };

  const stopTimer = (jobSheetId: number) => {
    setActiveTimer(null);
    // In real app, make API call to stop time tracking
    console.log(`Stopped timer for job sheet ${jobSheetId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING_APPROVAL': return 'bg-purple-100 text-purple-800';
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
  if (!isAuthenticated || !user || user.role.toLowerCase() !== 'technician') {
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
              <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📋</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Assigned Jobs</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.assignedJobs}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🔧</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.inProgressJobs}</dd>
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
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⏱️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Hours Today</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalHoursToday}h</dd>
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
                    <span className="text-white text-sm font-medium">📝</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Approval</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingApproval}</dd>
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
                Start New Job
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Log Time
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Request Parts
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Submit Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Job Sheets */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Job Sheets</h3>
              <div className="space-y-4">
                {jobSheets.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{job.requestNumber}</h4>
                        <p className="text-sm text-gray-600">{job.customerName} - {job.vehicleModel}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{job.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span>Est: {job.estimatedHours}h</span>
                      <span>Actual: {job.actualHours}h</span>
                    </div>
                    <div className="flex space-x-2">
                      {job.status === 'ASSIGNED' && (
                        <button
                          onClick={() => startTimer(job.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Start Job
                        </button>
                      )}
                      {job.status === 'IN_PROGRESS' && (
                        <>
                          {activeTimer === job.id ? (
                            <button
                              onClick={() => stopTimer(job.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              Stop Timer
                            </button>
                          ) : (
                            <button
                              onClick={() => startTimer(job.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              Resume Timer
                            </button>
                          )}
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-medium">
                            Complete Job
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Time Logs */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Time Logs</h3>
              <div className="space-y-4">
                {timeLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Job Sheet #{log.jobSheetId}</h4>
                        <p className="text-sm text-gray-600">{log.description}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{log.hoursLogged}h</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.startTime).toLocaleString()} - {log.endTime ? new Date(log.endTime).toLocaleString() : 'In Progress'}
                    </div>
                  </div>
                ))}
                {timeLogs.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No time logs found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}