'use client';

import { useState } from 'react';
import { RequestType } from '../../lib/types';

interface ServiceRequestForm {
  customerName: string;
  customerPhone: string;
  chassisNumber: string;
  type: RequestType;
  issueDescription: string;
  customerLocation: string;
}

interface VehicleInfo {
  found: boolean;
  vehicle?: {
    chassisNumber: string;
    modelName: string;
    purchaseDate: string;
  };
  customer?: {
    name: string;
    phone: string;
  };
  warranty?: {
    isUnderWarranty: boolean;
    warrantyEndDate: string;
    daysRemaining: number;
  };
  message?: string;
}

export default function ServiceRequestPage() {
  const [formData, setFormData] = useState<ServiceRequestForm>({
    customerName: '',
    customerPhone: '',
    chassisNumber: '',
    type: RequestType.OTHER,
    issueDescription: '',
    customerLocation: '',
  });

  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [isCheckingVehicle, setIsCheckingVehicle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const checkVehicle = async () => {
    if (!formData.chassisNumber || formData.chassisNumber.length < 8) {
      alert('Please enter a valid chassis number (at least 8 characters)');
      return;
    }

    setIsCheckingVehicle(true);
    try {
      const response = await fetch(`http://localhost:3001/public/service-requests/check-vehicle/${formData.chassisNumber}`);
      const data = await response.json();
      setVehicleInfo(data);

      if (data.found) {
        setFormData(prev => ({
          ...prev,
          customerName: data.customer?.name || '',
          customerPhone: data.customer?.phone || '',
        }));
      }
    } catch (error) {
      console.error('Error checking vehicle:', error);
      alert('Error checking vehicle information');
    } finally {
      setIsCheckingVehicle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.chassisNumber || !formData.issueDescription) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/public/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setSubmitResult(result);

      if (result.success) {
        setFormData({
          customerName: '',
          customerPhone: '',
          chassisNumber: '',
          type: RequestType.OTHER,
          issueDescription: '',
          customerLocation: '',
        });
        setVehicleInfo(null);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting service request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">Request Submitted Successfully!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your service request has been created with ticket number:
            </p>
            <p className="mt-1 text-lg font-semibold text-blue-600">{submitResult.ticketNumber}</p>
            <p className="mt-2 text-sm text-gray-600">
              Warranty Status: <span className={`font-medium ${submitResult.warrantyStatus === 'Valid' ? 'text-green-600' : 'text-red-600'}`}>
                {submitResult.warrantyStatus}
              </span>
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Please save this ticket number for future reference. We will contact you soon.
            </p>
            <button
              onClick={() => setSubmitResult(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Request Form</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h3>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="chassisNumber" className="block text-sm font-medium text-gray-700">
                    Vehicle Chassis Number *
                  </label>
                  <input
                    type="text"
                    id="chassisNumber"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter 10-17 character chassis number"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={checkVehicle}
                    disabled={isCheckingVehicle}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isCheckingVehicle ? 'Checking...' : 'Check Vehicle'}
                  </button>
                </div>
              </div>

              {vehicleInfo && (
                <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
                  {vehicleInfo.found ? (
                    <div>
                      <p className="text-sm font-medium text-green-800">✓ Vehicle Found</p>
                      <p className="text-sm text-gray-600">Model: {vehicleInfo.vehicle?.modelName || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Purchase Date: {vehicleInfo.vehicle?.purchaseDate}</p>
                      <p className="text-sm text-gray-600">
                        Warranty: <span className={vehicleInfo.warranty?.isUnderWarranty ? 'text-green-600' : 'text-red-600'}>
                          {vehicleInfo.warranty?.isUnderWarranty ? 'Valid' : 'Expired'}
                        </span>
                        {vehicleInfo.warranty?.isUnderWarranty && (
                          <span className="text-gray-500"> ({vehicleInfo.warranty.daysRemaining} days remaining)</span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-800">⚠ {vehicleInfo.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="customerLocation" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="customerLocation"
                  name="customerLocation"
                  value={formData.customerLocation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your current location"
                />
              </div>
            </div>

            {/* Service Request Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Service Request Details</h3>
              
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Service Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={RequestType.OIL_CHANGE_SERVICE}>Oil Change/Service</option>
                  <option value={RequestType.VEHICLE_BREAKDOWN}>Vehicle Breakdown</option>
                  <option value={RequestType.WARRANTY_CLAIM}>Warranty Claim</option>
                  <option value={RequestType.OTHER}>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700">
                  Issue Description *
                </label>
                <textarea
                  id="issueDescription"
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe the issue with your vehicle in detail..."
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Service Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
