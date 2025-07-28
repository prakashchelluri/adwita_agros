'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/lib/types';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [user, setUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await axios.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      fetchUser();
    }
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.patch(`/users/${id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/admin/users');
    } catch (err) {
      setError('Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-xl font-bold mb-4">Edit User</h1>
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
          <label htmlFor="username" className="block font-medium">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={user.username || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="fullName" className="block font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={user.fullName || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={user.email || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block font-medium">Role</label>
          <select
            name="role"
            id="role"
            value={user.role || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="supervisor">Supervisor</option>
            <option value="technician">Technician</option>
            <option value="manufacturer">Manufacturer</option>
          </select>
        </div>
        <div>
          <label htmlFor="password" className="block font-medium">Reset Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={user.password || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter new password"
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
