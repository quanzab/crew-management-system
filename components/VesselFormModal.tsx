
import React, { useState, useEffect } from 'react';
import { Vessel, VesselFormData } from '../types';
import Card from './Card';
import { XIcon } from './icons/XIcon';

interface VesselFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VesselFormData) => void;
  initialData?: Vessel | null;
}

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const VesselFormModal: React.FC<VesselFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    imo: '',
    type: '',
    longitude: '',
    latitude: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        imo: String(initialData.imo),
        type: initialData.type,
        longitude: String(initialData.location[0]),
        latitude: String(initialData.location[1]),
      });
    } else {
      // Reset form for 'add' mode
      setFormData({
        name: '',
        imo: '',
        type: '',
        longitude: '',
        latitude: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData: VesselFormData = {
      name: formData.name,
      imo: parseInt(formData.imo, 10) || 0,
      type: formData.type,
      location: [
        parseFloat(formData.longitude) || 0,
        parseFloat(formData.latitude) || 0,
      ],
    };
    onSubmit(finalData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-card-foreground">
            {initialData ? 'Edit Vessel' : 'Add New Vessel'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={labelClass}>Vessel Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="imo" className={labelClass}>IMO Number</label>
              <input type="number" id="imo" name="imo" value={formData.imo} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="type" className={labelClass}>Vessel Type</label>
              <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} className={inputClass} required />
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="longitude" className={labelClass}>Longitude</label>
                <input type="number" step="any" id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="latitude" className={labelClass}>Latitude</label>
                <input type="number" step="any" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-muted text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              {initialData ? 'Save Changes' : 'Add Vessel'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VesselFormModal;
