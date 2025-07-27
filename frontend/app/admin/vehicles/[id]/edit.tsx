'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { Vehicle } from '@/lib/types';

export default function EditVehiclePage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [vehicle, setVehicle] = useState<Partial<Vehicle>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        setLoading(true);
        const response = await axios.get(`/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicle(response.data);
      } catch (err) {
        setError('Failed to load vehicle data');
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      fetchVehicle();
    }
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.patch(`/vehicles/${id}`, vehicle, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/admin/vehicles');
    } catch (err) {
      setError('Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading vehicle data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-xl font-bold mb-4">Edit Vehicle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="chassisNumber" className="block font-medium">Chassis Number</label>
          <input
            type="text"
            name="chassisNumber"
            id="chassisNumber"
            value={vehicle.chassisNumber || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="purchaseDate" className="block font-medium">Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            id="purchaseDate"
            value={vehicle.purchaseDate ? vehicle.purchaseDate.substring(0, 10) : ''}
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
