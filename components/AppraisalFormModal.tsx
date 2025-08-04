
import React, { useState, useEffect } from 'react';
import { AppraisalFormData } from '../types';
import { useData } from '../hooks/useData';
import Card from './Card';
import { XIcon } from './icons/XIcon';

interface AppraisalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppraisalFormData) => void;
}

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const AppraisalFormModal: React.FC<AppraisalFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { crew } = useData();
  const [formData, setFormData] = useState<AppraisalFormData>({
    crewMemberId: '',
    assessor: 'Admin User',
    date: new Date().toISOString().split('T')[0],
    performance: 3,
    teamwork: 3,
    safety: 3,
    comments: '',
  });

  useEffect(() => {
    // If the modal is opened and no crew member is selected yet, default to the first one.
    if (isOpen && !formData.crewMemberId && crew.length > 0) {
      setFormData(prev => ({ ...prev, crewMemberId: crew[0].id }));
    }
  }, [isOpen, crew, formData.crewMemberId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name.includes('score') ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.crewMemberId) {
        alert("Please select a crew member.");
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
            New Performance Appraisal
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="crewMemberId" className={labelClass}>Crew Member</label>
            <select id="crewMemberId" name="crewMemberId" value={formData.crewMemberId} onChange={handleChange} className={inputClass}>
              <option value="" disabled>Select a crew member</option>
              {crew.map(c => <option key={c.id} value={c.id}>{c.name} - {c.rank}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="performance" className={labelClass}>Performance ({formData.performance})</label>
              <input type="range" id="performance" name="performance" value={formData.performance} onChange={handleChange} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer" min="1" max="5" />
            </div>
            <div>
              <label htmlFor="teamwork" className={labelClass}>Teamwork ({formData.teamwork})</label>
              <input type="range" id="teamwork" name="teamwork" value={formData.teamwork} onChange={handleChange} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer" min="1" max="5" />
            </div>
            <div>
              <label htmlFor="safety" className={labelClass}>Safety ({formData.safety})</label>
              <input type="range" id="safety" name="safety" value={formData.safety} onChange={handleChange} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer" min="1" max="5" />
            </div>
          </div>

          <div>
            <label htmlFor="comments" className={labelClass}>Assessor's Comments</label>
            <textarea id="comments" name="comments" value={formData.comments} onChange={handleChange} className={inputClass} rows={4} placeholder="Provide detailed feedback..." required></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="assessor" className={labelClass}>Assessor</label>
              <input type="text" id="assessor" name="assessor" value={formData.assessor} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="date" className={labelClass}>Date of Appraisal</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} required />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-muted text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Save Appraisal
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AppraisalFormModal;