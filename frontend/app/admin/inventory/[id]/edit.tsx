'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { InventoryPart } from '@/lib/types';

export default function EditInventoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [part, setPart] = useState<Partial<InventoryPart>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPart() {
      try {
        setLoading(true);
        const response = await axios.get(`/inventory/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPart(response.data);
      } catch (err) {
        setError('Failed to load inventory part data');
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      fetchPart();
    }
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPart({ ...part, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.patch(`/inventory/${id}`, part, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/admin/inventory');
    } catch (err) {
      setError('Failed to save inventory part');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading inventory part data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-xl font-bold mb-4">Edit Inventory Part</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Home
        </button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="partNumber" className="block font-medium">Part Number</label>
          <input
            type="text"
            name="partNumber"
            id="partNumber"
            value={part.partNumber || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={part.name || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
