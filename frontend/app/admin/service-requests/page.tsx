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
      <h1 className="text-2xl font-bold mb-4">All Service Requests</h1>
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
              <td className="py-2 px-4 border-b">{request.customer.fullName}</td>
              <td className="py-2 px-4 border-b">{request.vehicle.chassisNumber}</td>
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
