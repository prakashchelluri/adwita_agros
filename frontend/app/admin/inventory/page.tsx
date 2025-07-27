'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { InventoryPart } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export default function AdminInventoryPage() {
  const { token } = useAuth();
  const [parts, setParts] = useState<InventoryPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/inventory', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParts(response.data);
      } catch (err) {
        setError('Failed to load inventory parts');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchParts();
    }
  }, [token]);

  if (loading) return <div>Loading inventory parts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Part Number</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parts.map(part => (
            <tr key={part.id} className="text-center">
              <td className="py-2 px-4 border-b">{part.partNumber}</td>
              <td className="py-2 px-4 border-b">{part.name}</td>
              <td className="py-2 px-4 border-b">
                <a href={`/admin/inventory/${part.id}/edit`} className="text-blue-600 hover:underline">Edit</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
