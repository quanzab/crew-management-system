
import React, { useState, useEffect, useMemo } from 'react';
import { InvoiceFormData } from '../types';
import { useData } from '../hooks/useData';
import Card from './Card';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => void;
}

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { principals } = useData();
  const [formData, setFormData] = useState<InvoiceFormData>({
    principalId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxRate: 0,
  });

  useEffect(() => {
    if (isOpen && !formData.principalId && principals.length > 0) {
      setFormData(prev => ({ ...prev, principalId: principals[0].id }));
    }
    if(!isOpen) {
       setFormData({
            principalId: principals.length > 0 ? principals[0].id : '',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: '',
            lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
            taxRate: 0,
       });
    }
  }, [isOpen, principals, formData.principalId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'taxRate' ? parseFloat(value) || 0 : value }));
  };

  const handleLineItemChange = (index: number, field: 'description' | 'quantity' | 'unitPrice', value: string | number) => {
    const updatedLineItems = [...formData.lineItems];
    updatedLineItems[index] = { ...updatedLineItems[index], [field]: value };
    setFormData(prev => ({ ...prev, lineItems: updatedLineItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, unitPrice: 0 }],
    }));
  };

  const removeLineItem = (index: number) => {
    const updatedLineItems = formData.lineItems.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, lineItems: updatedLineItems }));
  };

  const { subtotal, taxAmount, total } = useMemo(() => {
    const sub = formData.lineItems.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
    const tax = sub * (formData.taxRate / 100);
    const tot = sub + tax;
    return { subtotal: sub, taxAmount: tax, total: tot };
  }, [formData.lineItems, formData.taxRate]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.principalId) {
      alert("Please select a principal.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-card-foreground">Create New Invoice</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted"><XIcon className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="principalId" className={labelClass}>Principal (Client)</label>
              <select id="principalId" name="principalId" value={formData.principalId} onChange={handleChange} className={inputClass} required>
                <option value="" disabled>Select a principal</option>
                {principals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="issueDate" className={labelClass}>Issue Date</label>
              <input type="date" id="issueDate" name="issueDate" value={formData.issueDate} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="dueDate" className={labelClass}>Due Date</label>
              <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} className={inputClass} required />
            </div>
          </div>

          <div>
            <label className={labelClass}>Line Items</label>
            <div className="space-y-2">
              {formData.lineItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="text" placeholder="Description" value={item.description} onChange={e => handleLineItemChange(index, 'description', e.target.value)} className={inputClass} required />
                  <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))} className={`${inputClass} w-24`} min="1" required />
                  <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={e => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value))} className={`${inputClass} w-32`} min="0" step="0.01" required />
                  <button type="button" onClick={() => removeLineItem(index)} className="p-2 text-red-500 hover:text-red-700" aria-label="Remove item"><TrashIcon className="h-5 w-5"/></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addLineItem} className="mt-2 text-sm text-primary-500 hover:text-primary-600 font-semibold">+ Add Line Item</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-muted">
             <div>
                <label htmlFor="taxRate" className={labelClass}>Tax Rate (%)</label>
                <input type="number" id="taxRate" name="taxRate" value={formData.taxRate} onChange={handleChange} className={inputClass} min="0" step="0.1" />
             </div>
             <div className="col-span-2 text-right space-y-1">
                <p className="text-muted-foreground">Subtotal: <span className="font-semibold text-card-foreground">{formatCurrency(subtotal)}</span></p>
                <p className="text-muted-foreground">Tax: <span className="font-semibold text-card-foreground">{formatCurrency(taxAmount)}</span></p>
                <p className="text-lg text-muted-foreground font-bold">Total: <span className="text-xl text-foreground">{formatCurrency(total)}</span></p>
             </div>
          </div>
        </form>
        <div className="flex justify-end pt-6 border-t border-muted mt-6 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-muted text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Create Invoice</button>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceFormModal;