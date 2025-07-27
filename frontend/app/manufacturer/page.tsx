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
  warrantyStatus: string;
  createdAt: string;
}

interface WarrantyClaim {
  id: number;
  serviceRequestId: number;
  requestNumber: string;
  claimAmount: number;
  status: string;
  submittedAt: string;
  approvedAt?: string;
}

interface InventoryAlert {
  id: number;
  partName: string;
  currentStock: number;
  minimumStock: number;
  status: string;
}

export default function ManufacturerDashboard() {
  const { user, isLoading, isAuthenticated, isHydrated } = useAuth();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [stats, setStats] = useState({
    totalWarrantyRequests: 0,
    pendingApproval: 0,
    approvedClaims: 0,
    totalClaimAmount: 0,
    lowStockAlerts: 0,
    activeServiceCenters: 12
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
    if (!isAuthenticated || !user || user.role.toLowerCase() !== 'manufacturer') {
      console.log('Manufacturer access denied, redirecting to login');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    // Fetch manufacturer dashboard data
    fetchDashboardData();
  }, [isAuthenticated, user, isLoading, isHydrated]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Mock data for manufacturer dashboard
      const mockServiceRequests: ServiceRequest[] = [
        {
          id: 1,
          requestNumber: 'SR-001',
          customerName: 'John Doe',
          vehicleModel: 'Tractor Model X',
          status: 'PENDING_MANUFACTURER_APPROVAL',
          priority: 'HIGH',
          warrantyStatus: 'UNDER_WARRANTY',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          requestNumber: 'SR-002',
          customerName: 'Jane Smith',
          vehicleModel: 'Harvester Pro',
          status: 'MANUFACTURER_APPROVED',
          priority: 'MEDIUM',
          warrantyStatus: 'WARRANTY_EXPIRED',
          createdAt: new Date().toISOString()
        }
      ];

      const mockWarrantyClaims: WarrantyClaim[] = [
        {
          id: 1,
          serviceRequestId: 1,
          requestNumber: 'SR-001',
          claimAmount: 2500.00,
          status: 'PENDING',
          submittedAt: new Date().toISOString()
        },
        {
          id: 2,
          serviceRequestId: 2,
          requestNumber: 'SR-002',
          claimAmount: 1800.00,
          status: 'APPROVED',
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          approvedAt: new Date().toISOString()
        }
      ];

      const mockInventoryAlerts: InventoryAlert[] = [
        {
          id: 1,
          partName: 'Engine Oil Filter',
          currentStock: 5,
          minimumStock: 20,
          status: 'LOW_STOCK'
        },
        {
          id: 2,
          partName: 'Hydraulic Pump',
          currentStock: 2,
          minimumStock: 10,
          status: 'CRITICAL'
        }
      ];

      setServiceRequests(mockServiceRequests);
      setWarrantyClaims(mockWarrantyClaims);
      setInventoryAlerts(mockInventoryAlerts);

      // Calculate stats
      const pendingApproval = mockServiceRequests.filter(r => r.status === 'PENDING_MANUFACTURER_APPROVAL').length;
      const approvedClaims = mockWarrantyClaims.filter(c => c.status === 'APPROVED').length;
      const totalClaimAmount = mockWarrantyClaims.reduce((sum, claim) => sum + claim.claimAmount, 0);
      const lowStockAlerts = mockInventoryAlerts.length;

      setStats({
        totalWarrantyRequests: mockServiceRequests.length,
        pendingApproval: pendingApproval,
        approvedClaims: approvedClaims,
        totalClaimAmount: totalClaimAmount,
        lowStockAlerts: lowStockAlerts,
        activeServiceCenters: 12
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

  const approveWarrantyClaim = async (claimId: number) => {
    // In real app, make API call to approve warranty claim
    console.log(`Approving warranty claim ${claimId}`);
    // Update local state for demo
    setWarrantyClaims(prev => 
      prev.map(claim => 
        claim.id === claimId 
          ? { ...claim, status: 'APPROVED', approvedAt: new Date().toISOString() }
          : claim
      )
    );
  };

  const rejectWarrantyClaim = async (claimId: number) => {
    // In real app, make API call to reject warranty claim
    console.log(`Rejecting warranty claim ${claimId}`);
    // Update local state for demo
    setWarrantyClaims(prev => 
      prev.map(claim => 
        claim.id === claimId 
          ? { ...claim, status: 'REJECTED' }
          : claim
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_MANUFACTURER_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'MANUFACTURER_APPROVED': return 'bg-green-100 text-green-800';
      case 'MANUFACTURER_REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWarrantyStatusColor = (status: string) => {
    switch (status) {
      case 'UNDER_WARRANTY': return 'text-green-600';
      case 'WARRANTY_EXPIRED': return 'text-red-600';
      case 'WARRANTY_VOID': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'LOW_STOCK': return 'bg-yellow-100 text-yellow-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
  if (!isAuthenticated || !user || user.role.toLowerCase() !== 'manufacturer') {
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
              <h1 className="text-2xl font-bold text-gray-900">Manufacturer Dashboard</h1>
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
                    <span className="text-white text-sm font-medium">🛡️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Warranty Requests</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalWarrantyRequests}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Approval</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingApproval}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Approved Claims</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.approvedClaims}</dd>
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
                    <span className="text-white text-sm font-medium">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Claims</dt>
                    <dd className="text-lg font-medium text-gray-900">${stats.totalClaimAmount.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⚠️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Stock Alerts</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.lowStockAlerts}</dd>
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
                    <span className="text-white text-sm font-medium">🏢</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Service Centers</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeServiceCenters}</dd>
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
                Review Warranty Claims
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Manage Inventory
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Service Center Reports
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Analytics Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pending Warranty Claims */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Pending Warranty Claims</h3>
              <div className="space-y-4">
                {warrantyClaims.filter(claim => claim.status === 'PENDING').map((claim) => (
                  <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{claim.requestNumber}</h4>
                        <p className="text-sm text-gray-600">Claim Amount: ${claim.claimAmount.toLocaleString()}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => approveWarrantyClaim(claim.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectWarrantyClaim(claim.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {warrantyClaims.filter(claim => claim.status === 'PENDING').length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No pending warranty claims</p>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Inventory Alerts</h3>
              <div className="space-y-4">
                {inventoryAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{alert.partName}</h4>
                        <p className="text-sm text-gray-600">
                          Current: {alert.currentStock} | Minimum: {alert.minimumStock}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getInventoryStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium">
                      Reorder Stock
                    </button>
                  </div>
                ))}
                {inventoryAlerts.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No inventory alerts</p>
                )}
              </div>
            </div>
          </div>
        </div>

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
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Warranty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.requestNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.vehicleModel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={getWarrantyStatusColor(request.warrantyStatus)}>
                          {request.warrantyStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}