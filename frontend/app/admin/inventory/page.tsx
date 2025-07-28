'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { InventoryPart } from '../../../lib/types';

const AdminInventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await api.get('/inventory', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInventory(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch inventory. Please check your authentication.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Back
          </button>
          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Home
          </Link>
        </div>
      </div>

      {loading && <p>Loading inventory...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Part Number</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {inventory.map((part) => (
                <tr key={part.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{part.partNumber}</td>
                  <td className="py-3 px-4">{part.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryPage;