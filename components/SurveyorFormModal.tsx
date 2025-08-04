

import React, { useState, useEffect } from 'react';
import { SurveyorFinding, SurveyorFindingFormData, Attachment } from '../types';
import { useData } from '../hooks/useData';
import { handleSummarizeFinding } from '../services/geminiService';
import Card from './Card';
import { XIcon } from './icons/XIcon';
import { PdfIcon } from './icons/PdfIcon';

interface SurveyorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const SurveyorFormModal: React.FC<SurveyorFormModalProps> = ({ isOpen, onClose }) => {
  const { vessels, addSurveyorFinding } = useData();
  const [formData, setFormData] = useState<Omit<SurveyorFindingFormData, 'attachments'>>({
    title: '',
    vesselId: '',
    description: '',
    submittedBy: 'Admin User',
  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !formData.vesselId && vessels.length > 0) {
      setFormData(prev => ({ ...prev, vesselId: vessels[0].id }));
    }
  }, [isOpen, vessels, formData.vesselId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const filePromises = files.map(file => {
        return new Promise<Attachment>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const fileType = file.type.startsWith('image/') ? 'image' : (file.type === 'application/pdf' ? 'pdf' : null);
            if (fileType) {
              resolve({
                name: file.name,
                type: fileType,
                dataUrl: reader.result as string,
              });
            } else {
              reject(new Error(`Unsupported file type: ${file.name}. Please upload images or PDFs.`));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises)
        .then(newAttachments => {
          setAttachments(prev => [...prev, ...newAttachments]);
        })
        .catch(error => {
          console.error("Error reading files:", error);
          alert(error.message);
        });
    }
  };


  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vesselId || !formData.title || !formData.description) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const aiSummary = await handleSummarizeFinding(formData.description);
      
      const newFinding: SurveyorFinding = {
        ...formData,
        id: `SF${Date.now()}`,
        attachments: attachments,
        submittedAt: new Date().toISOString(),
        aiSummary,
      };
      
      addSurveyorFinding(newFinding);
      onClose();

    } catch (error) {
        console.error("Failed to submit finding:", error);
        alert("An error occurred while generating the AI summary. The finding was not submitted.");
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-card-foreground">
            Submit Surveyor Finding
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted" disabled={isLoading}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className={labelClass}>Finding Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="vesselId" className={labelClass}>Vessel</label>
              <select id="vesselId" name="vesselId" value={formData.vesselId} onChange={handleChange} className={inputClass}>
                <option value="" disabled>Select a vessel</option>
                {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Detailed Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={inputClass} rows={5} placeholder="Describe the issue in detail..." required />
          </div>

          <div>
            <label htmlFor="attachments" className={labelClass}>Attach Images or PDFs</label>
            <input type="file" id="attachments" name="attachments" onChange={handleFileChange} className={`${inputClass} p-0 file:p-2 file:bg-muted file:border-0 file:mr-4 file:text-card-foreground`} multiple accept="image/*,application/pdf" />
            
            {attachments.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {attachments.map((attachment, index) => (
                        <div key={index} className="relative group">
                             {attachment.type === 'image' ? (
                                <img src={attachment.dataUrl} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md"/>
                            ) : (
                                <div className="w-full h-24 bg-muted rounded-md flex flex-col items-center justify-center p-2 text-center">
                                    <PdfIcon className="w-8 h-8 text-primary-500 flex-shrink-0"/>
                                    <span className="text-xs text-muted-foreground mt-1 w-full truncate">{attachment.name}</span>
                                </div>
                            )}
                            <button 
                                type="button" 
                                onClick={() => removeAttachment(index)}
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-muted text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-wait">
              {isLoading ? 'Summarizing & Saving...' : 'Submit Finding'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SurveyorFormModal;