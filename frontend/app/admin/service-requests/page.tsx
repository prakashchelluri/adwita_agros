'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ServiceRequest } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export default function AdminServiceRequestsPage() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/service-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (err) {
        setError('Failed to load service requests');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRequests();
    }
  }, [token]);

  if (loading) return <div>Loading service requests...</div>;
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
      <h1 className="text-2xl font-bold mb-4">All Service Requests</h1>

      <div className="mb-4 w-1/3">
        <label htmlFor="search" className="block font-semibold mb-1">Search by Ticket Number</label>
        <input
          id="search"
          type="text"
          placeholder="Enter ticket number"
          className="w-full p-2 border border-gray-300 rounded"
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            setRequests((prevRequests) =>
              prevRequests.filter((request) =>
                request.ticketNumber.toLowerCase().includes(searchTerm)
              )
            );
          }}
        />
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Ticket Number</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Customer</th>
            <th className="py-2 px-4 border-b">Vehicle</th>
            <th className="py-2 px-4 border-b">Assigned Technician</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id} className="text-center">
              <td className="py-2 px-4 border-b">{request.ticketNumber}</td>
              <td className="py-2 px-4 border-b">{request.type}</td>
              <td className="py-2 px-4 border-b">{request.status}</td>
              <td className="py-2 px-4 border-b">{request.customer?.fullName || 'N/A'}</td>
              <td className="py-2 px-4 border-b">{request.vehicle?.chassisNumber || 'N/A'}</td>
              <td className="py-2 px-4 border-b">{request.assignedTechnician?.fullName || 'Unassigned'}</td>
              <td className="py-2 px-4 border-b">
                <a href={`/admin/service-requests/${request.id}/edit`} className="text-blue-600 hover:underline">Edit</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
