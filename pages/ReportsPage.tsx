

import React, { useState } from 'react';
import Card from '../components/Card';
import { useData } from '../hooks/useData';
import { 
    generateCrewRosterReport, 
    generateVesselFleetReport, 
    generateInvoiceSummaryReport 
} from '../services/reportingService';
import { FileBarChartIcon } from '../components/icons/FileBarChartIcon';

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const ReportCard: React.FC<{ title: string, description: string, children?: React.ReactNode, onGenerate: () => void, isActionDisabled?: boolean }> = 
({ title, description, children, onGenerate, isActionDisabled = false }) => (
    <Card className="flex flex-col">
        <div className="flex-grow">
            <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
            {children}
        </div>
        <button 
            onClick={onGenerate} 
            disabled={isActionDisabled}
            className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            <FileBarChartIcon className="h-5 w-5"/>
            Generate PDF
        </button>
    </Card>
);


const ReportsPage: React.FC = () => {
    const { crew, vessels, invoices, principals } = useData();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [selectedCrewColumns, setSelectedCrewColumns] = useState<string[]>(['ID', 'Rank', 'Status']);
    const availableCrewColumns = ['ID', 'Rank', 'Nationality', 'Status', 'Assigned Vessel', 'Salary'];

    const handleCrewColumnToggle = (column: string) => {
        setSelectedCrewColumns(prev => 
            prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
        );
    };

    const handleGenerateInvoiceReport = () => {
        if (!startDate || !endDate) {
            alert("Please select a start and end date for the invoice summary.");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            alert("Start date cannot be after end date.");
            return;
        }
        generateInvoiceSummaryReport(invoices, principals, startDate, endDate);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Reporting & Analytics</h1>
            <p className="text-lg text-muted-foreground">Generate and download professional PDF reports for key business areas.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ReportCard
                    title="Crew Roster Report"
                    description="Generates a customizable list of all crew members. Select the columns you want to include."
                    onGenerate={() => generateCrewRosterReport(crew, vessels, selectedCrewColumns)}
                >
                    <div className="space-y-3">
                        <label className={labelClass}>Select Columns (Name is always included):</label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {availableCrewColumns.map(col => (
                                <label key={col} className="flex items-center space-x-2 text-sm text-card-foreground cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={selectedCrewColumns.includes(col)}
                                        onChange={() => handleCrewColumnToggle(col)}
                                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-muted text-primary-600 focus:ring-primary-500 focus:ring-offset-background"
                                    />
                                    <span>{col}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </ReportCard>
                <ReportCard
                    title="Vessel Fleet Report"
                    description="Generates a complete list of all vessels in the fleet, including their IMO number and type."
                    onGenerate={() => generateVesselFleetReport(vessels)}
                />
                <ReportCard
                    title="Invoice Summary Report"
                    description="Generates a financial summary of all invoices issued within a selected date range."
                    onGenerate={handleGenerateInvoiceReport}
                    isActionDisabled={!startDate || !endDate}
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="start-date" className={labelClass}>Start Date</label>
                            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="end-date" className={labelClass}>End Date</label>
                            <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </ReportCard>
            </div>
        </div>
    );
};

export default ReportsPage;