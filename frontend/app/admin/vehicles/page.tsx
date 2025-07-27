'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Vehicle } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export default function AdminVehiclesPage() {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  const [chassisNumber, setChassisNumber] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [primaryPhone, setPrimaryPhone] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/vehicles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVehicles(response.data);
      setFilteredVehicles(response.data);
    } catch (err) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchVehicles();
    }
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(
        vehicles.filter((vehicle) =>
          vehicle.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, vehicles]);

  const handleAddVehicleWithCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.post('/vehicles/with-customer', {
        chassisNumber,
        purchaseDate,
        fullName,
        invoiceNumber,
        primaryPhone,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChassisNumber('');
      setPurchaseDate('');
      setFullName('');
      setInvoiceNumber('');
      setPrimaryPhone('');
      fetchVehicles();
    } catch (err) {
      setError('Failed to add vehicle with customer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Home
        </a>
      </div>
      <h1 className="text-2xl font-bold mb-4">Vehicle Management</h1>

      <div className="mb-4">
        <label htmlFor="search" className="block font-semibold mb-1">Search by Vehicle Number</label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter vehicle number"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <form onSubmit={handleAddVehicleWithCustomer} className="mb-6">
        <div className="mb-2">
          <label htmlFor="chassisNumber" className="block font-semibold mb-1">Vehicle Number</label>
          <input
            id="chassisNumber"
            type="text"
            value={chassisNumber}
            onChange={(e) => setChassisNumber(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            disabled={submitting}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="fullName" className="block font-semibold mb-1">Customer Name</label>
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
          <label htmlFor="purchaseDate" className="block font-semibold mb-1">Purchase Date</label>
          <input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            disabled={submitting}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="invoiceNumber" className="block font-semibold mb-1">Invoice Number</label>
          <input
            id="invoiceNumber"
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
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
          {submitting ? 'Adding...' : 'Add Vehicle with Customer'}
        </button>
      </form>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Vehicle Number</th>
            <th className="py-2 px-4 border-b">Customer Name</th>
            <th className="py-2 px-4 border-b">Purchase Date</th>
            <th className="py-2 px-4 border-b">Invoice Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.map(vehicle => (
            <tr key={vehicle.id} className="text-center">
              <td className="py-2 px-4 border-b">{vehicle.chassisNumber}</td>
              <td className="py-2 px-4 border-b">{vehicle.customer?.fullName}</td>
              <td className="py-2 px-4 border-b">{vehicle.purchaseDate}</td>
              <td className="py-2 px-4 border-b">{vehicle.invoiceNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
