'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { ServiceRequest, ServiceRequestPartUsed, InventoryPart } from '@/lib/types';

export default function ServiceRequestPartsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [parts, setParts] = useState<InventoryPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedPart, setSelectedPart] = useState<number | ''>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch service request
        const requestResponse = await axios.get(`/service-requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequest(requestResponse.data);
        
        // Fetch all inventory parts
        const partsResponse = await axios.get('/inventory', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParts(partsResponse.data);
        
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

  const handleAddPart = async () => {
    if (!selectedPart || !quantity) return;
    
    setSaving(true);
    setError(null);
    try {
      await axios.post(`/service-requests/${id}/add-part`, {
        partId: selectedPart,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh request data
      const response = await axios.get(`/service-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequest(response.data);
      
      // Reset form
      setSelectedPart('');
      setQuantity(1);
    } catch (err) {
      setError('Failed to add part');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePart = async (partUsedId: number) => {
    setSaving(true);
    setError(null);
    try {
      await axios.delete(`/service-requests/${id}/remove-part/${partUsedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh request data
      const response = await axios.get(`/service-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequest(response.data);
    } catch (err) {
      setError('Failed to remove part');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading parts data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!request) return <div>Service request not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-xl font-bold mb-4">
        Parts Used for Request #{request.ticketNumber}
      </h1>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back to Request
        </button>
        <button
          onClick={() => router.push(`/admin/service-requests/${id}/edit`)}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Edit Service Request
        </button>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Home
        </button>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-medium mb-2">Add New Part</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="part" className="block font-medium mb-1">Select Part</label>
              <select
                id="part"
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a part</option>
                {parts.map(part => (
                  <option key={part.id} value={part.id}>
                    {part.partNumber} - {part.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-32">
              <label htmlFor="quantity" className="block font-medium mb-1">Quantity</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <button
              onClick={handleAddPart}
              disabled={saving || !selectedPart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Add Part
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-2">Current Parts Used</h2>
        {request.partsUsed.length === 0 ? (
          <p>No parts have been added to this request yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {request.partsUsed.map(partUsed => (
                <tr key={partUsed.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {partUsed.part.partNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {partUsed.part.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {partUsed.quantityUsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleRemovePart(partUsed.id)}
                      disabled={saving}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}