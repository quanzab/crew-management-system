
import React, { useState } from 'react';
import { DocumentFormData } from '../types';
import Card from './Card';
import { XIcon } from './icons/XIcon';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentFormData) => void;
}

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<DocumentFormData>({
    type: '',
    issueDate: '',
    expiryDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.issueDate || !formData.expiryDate) {
      alert("Please fill out all fields.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-card-foreground">
            Upload New Document
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="type" className={labelClass}>Document Type</label>
            <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} className={inputClass} placeholder="e.g., Passport, Visa" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="issueDate" className={labelClass}>Issue Date</label>
              <input type="date" id="issueDate" name="issueDate" value={formData.issueDate} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="expiryDate" className={labelClass}>Expiry Date</label>
              <input type="date" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className={inputClass} required />
            </div>
          </div>
          {/* A real app would have a file input here, but for this mock we only capture details */}
           <p className="text-xs text-muted-foreground text-center pt-2">Note: This is a simplified form. A production version would include a file upload field.</p>
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-muted text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Add Document
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DocumentUploadModal;
