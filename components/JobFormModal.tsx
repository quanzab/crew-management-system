
import React, { useState, useEffect } from 'react';
import { Job, JobFormData } from '../types';
import { useData } from '../hooks/useData';
import Card from './Card';
import { XIcon } from './icons/XIcon';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => void;
  initialData?: Job | null;
}

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const JobFormModal: React.FC<JobFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { crew, vessels } = useData();
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    assignedTo: 'crew',
    assigneeId: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        assignedTo: initialData.assignedTo,
        assigneeId: initialData.assigneeId,
        status: initialData.status,
      });
    } else {
      // Reset form for 'add' mode, and default to first crew member if available
      setFormData({
        title: '',
        description: '',
        assignedTo: 'crew',
        assigneeId: crew.length > 0 ? crew[0].id : '',
        status: 'Pending',
      });
    }
  }, [initialData, isOpen, crew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'assignedTo') {
        // When changing assignment type, reset assigneeId
        setFormData(prev => ({ 
            ...prev, 
            [name]: value as 'crew' | 'vessel',
            assigneeId: value === 'crew' ? (crew.length > 0 ? crew[0].id : '') : (vessels.length > 0 ? vessels[0].id : '')
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!formData.assigneeId) {
        alert("Please select an assignee.");
        return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-card-foreground">
            {initialData ? 'Edit Job' : 'Create New Job'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>Job Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={inputClass} rows={4} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="assignedTo" className={labelClass}>Assign To</label>
              <select id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange} className={inputClass}>
                <option value="crew">Crew Member</option>
                <option value="vessel">Vessel</option>
              </select>
            </div>
            <div>
                <label htmlFor="assigneeId" className={labelClass}>{formData.assignedTo === 'crew' ? 'Select Crew Member' : 'Select Vessel'}</label>
                <select id="assigneeId" name="assigneeId" value={formData.assigneeId} onChange={handleChange} className={inputClass}>
                    {formData.assignedTo === 'crew' ? (
                        crew.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    ) : (
                        vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)
                    )}
                </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-muted text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              {initialData ? 'Save Changes' : 'Create Job'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JobFormModal;