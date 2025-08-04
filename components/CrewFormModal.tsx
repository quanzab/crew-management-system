import React, { useState, useEffect } from 'react';
import { CrewMember, CrewFormData, Rank } from '../types';
import { useData } from '../hooks/useData';
import Card from './Card';
import { XIcon } from './icons/XIcon';

interface CrewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrewFormData) => void;
  initialData?: CrewMember | null;
}

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const CrewFormModal: React.FC<CrewFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { vessels } = useData();
  const [formData, setFormData] = useState<CrewFormData>({
    name: '',
    rank: Rank.AbleSeaman,
    vesselId: null,
    nationality: '',
    status: 'standby',
    salary: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        rank: initialData.rank,
        vesselId: initialData.vesselId,
        nationality: initialData.nationality,
        status: initialData.status,
        salary: initialData.salary,
      });
    } else {
      // Reset form for 'add' mode
      setFormData({
        name: '',
        rank: Rank.AbleSeaman,
        vesselId: null,
        nationality: '',
        status: 'standby',
        salary: 0,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'salary' ? parseFloat(value) || 0 : value }));
  };
  
  const handleVesselChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, vesselId: value === "null" ? null : value }));
  }

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
            {initialData ? 'Edit Crew Member' : 'Add New Crew Member'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={labelClass}>Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="nationality" className={labelClass}>Nationality</label>
              <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="rank" className={labelClass}>Rank</label>
              <select id="rank" name="rank" value={formData.rank} onChange={handleChange} className={inputClass}>
                {Object.values(Rank).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="standby">Standby</option>
              </select>
            </div>
             <div>
              <label htmlFor="vesselId" className={labelClass}>Assigned Vessel</label>
              <select id="vesselId" name="vesselId" value={formData.vesselId ?? "null"} onChange={handleVesselChange} className={inputClass}>
                <option value="null">N/A</option>
                {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="salary" className={labelClass}>Salary (Monthly USD)</label>
              <input type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange} className={inputClass} required min="0" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-muted text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              {initialData ? 'Save Changes' : 'Add Crew Member'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CrewFormModal;
