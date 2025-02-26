"use client";

import { useDistrictStore } from '@/lib/store/district-store';
import { useState } from 'react';

interface DistrictUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (districtName: string, product: string) => void;
  initialDistrictName?: string;
  initialProduct?: string;
}

export default function DistrictUpdateDialog({ 
  isOpen, 
  onClose, 
  onUpdate,
  initialDistrictName = '',
  initialProduct = ''
}: DistrictUpdateDialogProps) {
  const [districtName, setDistrictName] = useState(initialDistrictName);
  const [product, setProduct] = useState(initialProduct);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {updateDistrict,selectedDistrict,setSelectedDistrict}=useDistrictStore()
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Call the onUpdate function with the district name and product
      const {success,error}= await updateDistrict(districtName,product,selectedDistrict?.id as number)
      if(success){
        console.log("success")
      }
      onClose();
    } catch (err) {
      setError('Failed to update district');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-11/12 max-w-md rounded-lg bg-slate-50 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Update District</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-400"
          >
            <svg className="h-5 w-5" fill="none" stroke="black" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="districtName" className="mb-1 block text-sm font-medium text-slate-900">
              District Name
            </label>
            <input
              id="districtName"
              type="text"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              className="w-full rounded-md border border-slate-600 p-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="product" className="mb-1 block text-sm font-medium text-slate-900">
              Product
            </label>
            <input
              id="product"
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full text-slate-900 rounded-md border border-slate-600 p-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
}