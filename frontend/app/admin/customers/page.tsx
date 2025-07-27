'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Customer } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export default function AdminCustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [primaryPhone, setPrimaryPhone] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCustomers();
    }
  }, [token]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.post('/customers', { fullName, primaryPhone }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFullName('');
      setPrimaryPhone('');
      fetchCustomers();
    } catch (err) {
      setError('Failed to add customer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

      <form onSubmit={handleAddCustomer} className="mb-6">
        <div className="mb-2">
          <label htmlFor="fullName" className="block font-semibold mb-1">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            disabled={submitting}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="primaryPhone" className="block font-semibold mb-1">Primary Phone</label>
          <input
            id="primaryPhone"
            type="tel"
            value={primaryPhone}
            onChange={(e) => setPrimaryPhone(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Adding...' : 'Add Customer'}
        </button>
      </form>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Primary Phone</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="text-center">
              <td className="py-2 px-4 border-b">{customer.fullName}</td>
              <td className="py-2 px-4 border-b">{customer.primaryPhone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
