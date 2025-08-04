

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CrewMember, Vessel, Invoice, Principal } from '../types';

type jsPDFWithAutoTable = jsPDF & {
    autoTable: (options: any) => jsPDFWithAutoTable;
    lastAutoTable: { finalY: number };
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const addHeader = (doc: jsPDF, title: string) => {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CMS Pro - Internal Report', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 20);
    doc.setDrawColor(200);
    doc.line(14, 32, doc.internal.pageSize.getWidth() - 14, 32);
};

const addFooter = (doc: jsPDF) => {
    const pageCount = (doc.internal as any).getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
};

export const generateCrewRosterReport = (crew: CrewMember[], vessels: Vessel[], selectedColumns: string[]) => {
    const doc = new jsPDF({ orientation: 'landscape' }) as jsPDFWithAutoTable;
    addHeader(doc, 'Crew Roster Report');

    const getVesselName = (vesselId: string | null) => vessels.find(v => v.id === vesselId)?.name || 'N/A';
    
    // Name is always the first column
    const tableHead = [['Name', ...selectedColumns]];
    
    const tableBody = crew.map(c => {
        const row: (string | number)[] = [c.name];
        selectedColumns.forEach(col => {
            switch (col) {
                case 'ID':
                    row.push(c.id);
                    break;
                case 'Rank':
                    row.push(c.rank);
                    break;
                case 'Nationality':
                    row.push(c.nationality);
                    break;
                case 'Status':
                    row.push(c.status.charAt(0).toUpperCase() + c.status.slice(1));
                    break;
                case 'Assigned Vessel':
                    row.push(getVesselName(c.vesselId));
                    break;
                case 'Salary':
                    row.push(formatCurrency(c.salary));
                    break;
                default:
                    row.push('');
            }
        });
        return row;
    });


    doc.autoTable({
        startY: 40,
        head: tableHead,
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [8, 145, 178] },
        didDrawPage: () => addFooter(doc),
    });

    addFooter(doc); // Re-run footer for single page docs
    doc.save(`CMS_Crew_Roster_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateVesselFleetReport = (vessels: Vessel[]) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    addHeader(doc, 'Vessel Fleet Report');
    
    const tableHead = [['ID', 'Vessel Name', 'IMO', 'Type']];
    const tableBody = vessels.map(v => [v.id, v.name, v.imo, v.type]);

    doc.autoTable({
        startY: 40,
        head: tableHead,
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [8, 145, 178] },
        didDrawPage: () => addFooter(doc),
    });
    
    addFooter(doc);
    doc.save(`CMS_Vessel_Fleet_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateInvoiceSummaryReport = (invoices: Invoice[], principals: Principal[], startDate: string, endDate: string) => {
    const doc = new jsPDF({ orientation: 'landscape' }) as jsPDFWithAutoTable;
    const reportTitle = `Invoice Summary (${startDate} to ${endDate})`;
    addHeader(doc, reportTitle);

    const getPrincipalName = (principalId: string) => principals.find(p => p.id === principalId)?.name || 'Unknown';

    const filteredInvoices = invoices.filter(inv => {
        const issueDate = new Date(inv.issueDate);
        return issueDate >= new Date(startDate) && issueDate <= new Date(endDate);
    });
    
    const tableHead = [['Inv #', 'Principal', 'Issue Date', 'Due Date', 'Status', 'Subtotal', 'Tax', 'Total']];
    const tableBody = filteredInvoices.map(inv => [
        inv.invoiceNumber,
        getPrincipalName(inv.principalId),
        new Date(inv.issueDate).toLocaleDateString(),
        new Date(inv.dueDate).toLocaleDateString(),
        inv.status,
        formatCurrency(inv.subtotal),
        formatCurrency(inv.taxAmount),
        formatCurrency(inv.total)
    ]);
    
    const totalRevenue = filteredInvoices.reduce((acc, inv) => acc + inv.total, 0);

    doc.autoTable({
        startY: 40,
        head: tableHead,
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [8, 145, 178] },
        didDrawPage: () => addFooter(doc),
    });

    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Revenue for Period:', 14, finalY + 15);
    doc.text(formatCurrency(totalRevenue), 65, finalY + 15);
    
    addFooter(doc);
    doc.save(`CMS_Invoice_Summary_${startDate}_to_${endDate}.pdf`);
};
