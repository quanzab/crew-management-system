
import React, { useState, useEffect } from 'react';
import { Principal, PrincipalFormData } from '../types';
import Card from './Card';
import { XIcon } from './icons/XIcon';

interface PrincipalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PrincipalFormData) => void;
  initialData?: Principal | null;
}

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const PrincipalFormModal: React.FC<PrincipalFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<PrincipalFormData>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        contactPerson: initialData.contactPerson,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
      });
    } else {
      // Reset form for 'add' mode
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-card-foreground">
            {initialData ? 'Edit Principal' : 'Add New Principal'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={labelClass}>Company Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="contactPerson" className={labelClass}>Contact Person</label>
              <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
            </div>
          </div>
          <div>
            <label htmlFor="address" className={labelClass}>Address</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} className={inputClass} rows={3} required />
          </div>
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-muted text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              {initialData ? 'Save Changes' : 'Add Principal'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PrincipalFormModal;