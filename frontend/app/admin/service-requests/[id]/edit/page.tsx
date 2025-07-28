'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { ServiceRequest, RequestStatus, RequestType, User, UserRole } from '@/lib/types';
import Link from 'next/link';

export default function EditServiceRequestPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [request, setRequest] = useState<Partial<ServiceRequest>>({});
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sendingApproval, setSendingApproval] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch service request
        const requestResponse = await axios.get(`/service-requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequest(requestResponse.data);
        
        // Fetch all users and filter technicians
        const usersResponse = await axios.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const techs = usersResponse.data.filter((user: User) => user.role === UserRole.TECHNICIAN);
        setTechnicians(techs);
        
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    
    if (token) {
      fetchData();
    }
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const handleTechnicianChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const techId = parseInt(e.target.value);
    const technician = technicians.find(t => t.id === techId);
    setRequest({ ...request, assignedTechnician: technician || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.patch(`/service-requests/${id}`, request, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/admin/service-requests');
    } catch (err) {
      setError('Failed to save service request');
    } finally {
      setSaving(false);
    }
  };

  const sendForApproval = async () => {
    setSendingApproval(true);
    setError(null);
    try {
      await axios.post(`/service-requests/${id}/send-for-approval`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Request sent to manufacturer for approval');
      // Refresh request data
      const response = await axios.get(`/service-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequest(response.data);
    } catch (err) {
      setError('Failed to send for approval');
    } finally {
      setSendingApproval(false);
    }
  };

  if (loading) return <div>Loading service request data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-xl font-bold mb-4">Edit Service Request</h1>

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

      <div className="flex space-x-4 mb-4">
        <Link href={`/admin/service-requests/${id}/parts`}>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Manage Parts Used
          </button>
        </Link>
        
        <button
          onClick={sendForApproval}
          disabled={sendingApproval}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          {sendingApproval ? 'Sending...' : 'Send for Manufacturer Approval'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ticketNumber" className="block font-medium">Ticket Number</label>
          <input
            type="text"
            name="ticketNumber"
            id="ticketNumber"
            value={request.ticketNumber || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled
          />
        </div>
        
        <div>
          <label htmlFor="assignedTechnician" className="block font-medium">Assigned Technician</label>
          <select
            name="assignedTechnician"
            id="assignedTechnician"
            value={request.assignedTechnician?.id || ''}
            onChange={handleTechnicianChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select technician</option>
            {technicians.map(tech => (
              <option key={tech.id} value={tech.id}>{tech.fullName}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="type" className="block font-medium">Type</label>
          <select
            name="type"
            id="type"
            value={request.type || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select type</option>
            {Object.values(RequestType).map(type => (
              <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block font-medium">Status</label>
          <select
            name="status"
            id="status"
            value={request.status || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select status</option>
            {Object.values(RequestStatus).map(status => (
              <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="issueDescription" className="block font-medium">Issue Description</label>
          <textarea
            name="issueDescription"
            id="issueDescription"
            value={request.issueDescription || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={4}
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