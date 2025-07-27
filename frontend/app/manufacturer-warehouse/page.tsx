'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface InventoryItem {
  id: number;
  partNumber: string;
  partName: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
}

interface StockMovement {
  id: number;
  partNumber: string;
  partName: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER';
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason: string;
  createdAt: string;
}

interface PendingOrder {
  id: number;
  orderNumber: string;
  serviceCenter: string;
  requestedParts: Array<{
    partNumber: string;
    partName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  priority: string;
  status: string;
  requestedAt: string;
}

export default function ManufacturerWarehouseDashboard() {
  const { user, isLoading, isAuthenticated, isHydrated } = useAuth();

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [stats, setStats] = useState({
    totalParts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    pendingOrders: 0,
    totalInventoryValue: 0,
    todayMovements: 0,
  });

  // Fetch Data (simulate with mock for now)
  const fetchDashboardData = async () => {
    try {
      // Replace with real API in production.
      const mockInventoryItems: InventoryItem[] = [
        {
          id: 1,
          partNumber: 'ENG-001',
          partName: 'Engine Oil Filter',
          category: 'Engine Parts',
          currentStock: 15,
          minimumStock: 20,
          maximumStock: 100,
          unitPrice: 25.99,
          location: 'A-1-01',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 2,
          partNumber: 'HYD-002',
          partName: 'Hydraulic Pump',
          category: 'Hydraulics',
          currentStock: 2,
          minimumStock: 10,
          maximumStock: 50,
          unitPrice: 450.0,
          location: 'B-2-03',
          lastUpdated: new Date().toISOString(),
        },
      ];

      const mockStockMovements: StockMovement[] = [
        {
          id: 1,
          partNumber: 'ENG-001',
          partName: 'Engine Oil Filter',
          movementType: 'OUT',
          quantity: 5,
          toLocation: 'Service Center A',
          reason: 'Service Request SR-001',
          createdAt: new Date().toISOString(),
        },
      ];

      const mockPendingOrders: PendingOrder[] = [
        {
          id: 1,
          orderNumber: 'ORD-001',
          serviceCenter: 'Service Center A',
          requestedParts: [
            { partNumber: 'ENG-001', partName: 'Engine Oil Filter', quantity: 10, unitPrice: 25.99 },
            { partNumber: 'HYD-002', partName: 'Hydraulic Pump', quantity: 2, unitPrice: 450.0 },
          ],
          totalAmount: 2 * 450.0 + 10 * 25.99,
          priority: 'HIGH',
          status: 'PENDING_APPROVAL',
          requestedAt: new Date().toISOString(),
        },
      ];

      setInventoryItems(mockInventoryItems);
      setStockMovements(mockStockMovements);
      setPendingOrders(mockPendingOrders);

      // Calculate stats
      const lowStockItems = mockInventoryItems.filter(item => item.currentStock < item.minimumStock).length;
      const outOfStockItems = mockInventoryItems.filter(item => item.currentStock === 0).length;
      const totalParts = mockInventoryItems.length;
      const totalInventoryValue = mockInventoryItems.reduce(
        (sum, item) => sum + item.unitPrice * item.currentStock,
        0
      );
      const todayMovements = mockStockMovements.filter(
        m => new Date(m.createdAt).toDateString() === new Date().toDateString()
      ).length;

      setStats({
        totalParts,
        lowStockItems,
        outOfStockItems,
        pendingOrders: mockPendingOrders.length,
        totalInventoryValue,
        todayMovements,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    if (!isHydrated || isLoading) return;
    if (!isAuthenticated || !user || user.role.toLowerCase() !== 'manufacturer_warehouse') {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line
  }, [isHydrated, isLoading, isAuthenticated, user]);

  // Example approve/reject order actions (mock)
  const approveOrder = async (orderId: number) => {
    setPendingOrders(prev => prev.filter(order => order.id !== orderId));
    setStats(stats => ({ ...stats, pendingOrders: stats.pendingOrders - 1 }));
  };
  const rejectOrder = async (orderId: number) => {
    setPendingOrders(prev => prev.filter(order => order.id !== orderId));
    setStats(stats => ({ ...stats, pendingOrders: stats.pendingOrders - 1 }));
  };

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

  if (!isAuthenticated || !user || user.role.toLowerCase() !== 'manufacturer_warehouse') {
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
    <DashboardLayout>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500 text-xs">Total Parts</div>
          <div className="text-2xl font-semibold">{stats.totalParts}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500 text-xs">Low Stock</div>
          <div className="text-2xl font-semibold">{stats.lowStockItems}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500 text-xs">Out of Stock</div>
          <div className="text-2xl font-semibold">{stats.outOfStockItems}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500 text-xs">Pending Orders</div>
          <div className="text-2xl font-semibold">{stats.pendingOrders}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500 text-xs">Inventory Value</div>
          <div className="text-2xl font-semibold">${stats.totalInventoryValue.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500 text-xs">Today's Movements</div>
          <div className="text-2xl font-semibold">{stats.todayMovements}</div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pending Orders List */}
        <div className="bg-white shadow rounded-lg">
          <h2 className="p-4 border-b text-lg font-semibold">Pending Orders</h2>
          <div className="p-4">
            {pendingOrders.length === 0 && <div className="text-gray-400">No pending orders.</div>}
            {pendingOrders.map(order => (
              <div
                key={order.id}
                className="mb-4 border-b last:border-b-0 pb-4 last:pb-0 flex flex-col"
              >
                <div>
                  <span className="font-semibold">Order #{order.orderNumber}</span> — {order.serviceCenter}
                  <span className="ml-2 text-xs text-gray-500">({order.priority})</span>
                  <span className="ml-2 text-xs text-gray-400">{order.status}</span>
                </div>
                <div className="text-gray-500 text-xs mb-2">
                  Requested: {new Date(order.requestedAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Parts:</span>
                  <ul className="ml-4 list-disc text-sm text-gray-600">
                    {order.requestedParts.map((p, i) => (
                      <li key={p.partNumber + i}>
                        {p.partName} (#{p.partNumber}) — Qty: {p.quantity} @ ${p.unitPrice}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => approveOrder(order.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => rejectOrder(order.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Stock Movements */}
        <div className="bg-white shadow rounded-lg">
          <h2 className="p-4 border-b text-lg font-semibold">Recent Stock Movements</h2>
          <div className="p-4">
            {stockMovements.length === 0 && (
              <div className="text-gray-400">No stock movements.</div>
            )}
            {stockMovements.map(mvt => (
              <div key={mvt.id} className="mb-3 pb-2 border-b last:border-b-0 last:pb-0">
                <div className="font-semibold">
                  {mvt.movementType} — {mvt.partName} ({mvt.partNumber})
                </div>
                <div className="text-gray-500 text-xs">
                  Qty: {mvt.quantity} {mvt.toLocation && `→ ${mvt.toLocation}`}
                </div>
                <div className="text-xs text-gray-400">
                  {mvt.reason} · {new Date(mvt.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Overview */}
      <div className="bg-white shadow rounded-lg">
        <h2 className="p-4 border-b text-lg font-semibold">Inventory Overview</h2>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Part #</th>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Category</th>
                <th className="px-2 py-1 text-right">Stock</th>
                <th className="px-2 py-1 text-right">Min</th>
                <th className="px-2 py-1 text-right">Max</th>
                <th className="px-2 py-1 text-right">Unit Price</th>
                <th className="px-2 py-1 text-left">Location</th>
                <th className="px-2 py-1 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map(item => (
                <tr key={item.id}>
                  <td className="px-2 py-1">{item.partNumber}</td>
                  <td className="px-2 py-1">{item.partName}</td>
                  <td className="px-2 py-1">{item.category}</td>
                  <td
                    className={`px-2 py-1 text-right ${
                      item.currentStock === 0
                        ? 'text-red-600 font-bold'
                        : item.currentStock < item.minimumStock
                        ? 'text-yellow-700 font-semibold'
                        : ''
                    }`}
                  >
                    {item.currentStock}
                  </td>
                  <td className="px-2 py-1 text-right">{item.minimumStock}</td>
                  <td className="px-2 py-1 text-right">{item.maximumStock}</td>
                  <td className="px-2 py-1 text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="px-2 py-1">{item.location}</td>
                  <td className="px-2 py-1">{new Date(item.lastUpdated).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
