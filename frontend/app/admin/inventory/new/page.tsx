'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

export default function NewInventoryPartPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [partNumber, setPartNumber] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantityOnHand, setQuantityOnHand] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.post('/inventory', { partNumber, name, description, quantityOnHand }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/admin/inventory');
    } catch (err) {
      setError('Failed to create inventory part');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-xl font-bold mb-4">Add New Inventory Part</h1>
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
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="partNumber" className="block font-medium">Part Number</label>
          <input
            type="text"
            id="partNumber"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block font-medium">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="quantityOnHand" className="block font-medium">Quantity On Hand</label>
          <input
            type="number"
            id="quantityOnHand"
            value={quantityOnHand}
            onChange={(e) => setQuantityOnHand(parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            min={0}
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Part'}
        </button>
      </form>
    </div>
  );
}
