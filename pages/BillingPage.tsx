


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useData } from '../hooks/useData';
import { usePermissions } from '../hooks/usePermissions';
import Card from '../components/Card';
import { Invoice, InvoiceFormData } from '../types';
import { FileTextIcon } from '../components/icons/FileTextIcon';
import { DollarSignIcon } from '../components/icons/DollarSignIcon';
import InvoiceFormModal from '../components/InvoiceFormModal';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { exportToCsv } from '../services/exportService';

// Custom type for jsPDF with autoTable plugin
type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDFWithAutoTable;
  lastAutoTable: { finalY: number };
};

const BillingPage: React.FC = () => {
    const { invoices, principals, addInvoice, updateInvoiceStatus } = useData();
    const permissions = usePermissions();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('action') === 'add' && permissions.canCreateInvoice) {
            setIsModalOpen(true);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, permissions.canCreateInvoice, setSearchParams]);

    const handleFormSubmit = (data: InvoiceFormData) => {
        addInvoice(data);
        setIsModalOpen(false);
    };

    const handleMarkAsPaid = (invoiceId: string) => {
        if (window.confirm('Are you sure you want to mark this invoice as paid?')) {
            updateInvoiceStatus(invoiceId, 'Paid');
        }
    };

    const getPrincipalName = (principalId: string) => {
        return principals.find(p => p.id === principalId)?.name || 'Unknown Principal';
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };
    
    const statusColorClass = (status: Invoice['status']) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Draft': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
    
    const handleExport = () => {
        const headers = [
            { key: 'invoiceNumber', label: 'Invoice Number' },
            { key: 'principalName', label: 'Principal' },
            { key: 'issueDate', label: 'Issue Date' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'status', label: 'Status' },
            { key: 'subtotal', label: 'Subtotal' },
            { key: 'taxAmount', label: 'Tax Amount' },
            { key: 'total', label: 'Total' },
            { key: 'lineItems', label: 'Line Items' },
        ];
    
        const dataToExport = invoices.map(inv => ({
            ...inv,
            principalName: getPrincipalName(inv.principalId),
            lineItems: inv.lineItems.map(li => `${li.description} (Qty: ${li.quantity}, Price: ${li.unitPrice})`).join('; ')
        }));
    
        exportToCsv(dataToExport, headers, `CMS_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    };

    const generatePdf = (invoice: Invoice) => {
        const principal = principals.find(p => p.id === invoice.principalId);
        if (!principal) return;
        
        const doc = new jsPDF() as jsPDFWithAutoTable;
        
        // Header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 14, 22);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('CMS Pro, Inc.', 14, 30);
        doc.text('123 Marine Drive, Suite 100', 14, 35);
        doc.text('Seaport City, SC 12345', 14, 40);

        // Bill To
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', 120, 30);
        doc.setFont('helvetica', 'normal');
        doc.text(principal.name, 120, 35);
        doc.text(principal.address, 120, 40);
        doc.text(principal.email, 120, 45);
        
        // Invoice Details
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice Number:', 14, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.invoiceNumber, 50, 60);

        doc.setFont('helvetica', 'bold');
        doc.text('Issue Date:', 14, 65);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(invoice.issueDate).toLocaleDateString(), 50, 65);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Due Date:', 14, 70);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(invoice.dueDate).toLocaleDateString(), 50, 70);
        
        // Line Items Table
        const tableColumn = ["Description", "Quantity", "Unit Price", "Total"];
        const tableRows = invoice.lineItems.map(item => [
            item.description,
            item.quantity,
            formatCurrency(item.unitPrice),
            formatCurrency(item.quantity * item.unitPrice)
        ]);

        doc.autoTable({
            startY: 80,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [8, 145, 178] } // primary-600
        });
        
        // Totals
        const finalY = doc.lastAutoTable.finalY || 120;
        const rightAlign = 196;
        doc.setFontSize(12);
        
        doc.text('Subtotal:', 150, finalY + 10, { align: 'right' });
        doc.text(formatCurrency(invoice.subtotal), rightAlign, finalY + 10, { align: 'right' });

        doc.text(`Tax (${invoice.taxRate}%):`, 150, finalY + 17, { align: 'right' });
        doc.text(formatCurrency(invoice.taxAmount), rightAlign, finalY + 17, { align: 'right' });
        
        doc.setFont('helvetica', 'bold');
        doc.text('Total Amount Due:', 150, finalY + 24, { align: 'right' });
        doc.text(formatCurrency(invoice.total), rightAlign, finalY + 24, { align: 'right' });
        
        // Footer & Signature
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        doc.text('Thank you for your business!', 14, pageHeight - 25);
        doc.text('_________________________', 14, pageHeight - 15);
        doc.text('Authorized Signature', 14, pageHeight - 9);

        doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Billing & Invoicing</h1>
                 <div className="flex items-center space-x-2">
                    {permissions.canAccessReports && (
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-muted text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                            aria-label="Export to CSV"
                        >
                            <DownloadIcon className="h-5 w-5" />
                            <span>Export</span>
                        </button>
                    )}
                    {permissions.canCreateInvoice && (
                        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Create Invoice</button>
                    )}
                </div>
            </div>
           
            <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">All Invoices</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 dark:border-muted">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Number</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Principal</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Issue Date</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Due Date</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Total</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Status</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice: Invoice) => (
                                <tr key={invoice.id} className="border-b border-gray-200 dark:border-muted hover:bg-gray-50 dark:hover:bg-muted">
                                    <td className="p-3 font-medium text-gray-900 dark:text-card-foreground">{invoice.invoiceNumber}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{getPrincipalName(invoice.principalId)}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="p-3 font-semibold text-gray-900 dark:text-card-foreground">{formatCurrency(invoice.total)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorClass(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex space-x-2">
                                            <button onClick={() => generatePdf(invoice)} className="p-2 text-gray-400 hover:text-primary-500" aria-label="Generate PDF">
                                                <FileTextIcon className="h-5 w-5" />
                                            </button>
                                            {invoice.status !== 'Paid' && permissions.canCreateInvoice && (
                                                <button onClick={() => handleMarkAsPaid(invoice.id)} className="p-2 text-gray-400 hover:text-green-500" aria-label="Mark as Paid">
                                                    <DollarSignIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && (
                <InvoiceFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default BillingPage;
