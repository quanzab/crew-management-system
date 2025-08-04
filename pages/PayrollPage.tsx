
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import Card from '../components/Card';
import { CrewMember, Payroll } from '../types';
import { EyeIcon } from '../components/icons/EyeIcon';
import { FileTextIcon } from '../components/icons/FileTextIcon';
import { XIcon } from '../components/icons/XIcon';

const PayrollPage: React.FC = () => {
    const { crew, payroll } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
    const [crewPayrollHistory, setCrewPayrollHistory] = useState<Payroll[]>([]);

    const handleViewHistory = (crewMember: CrewMember) => {
        setSelectedCrew(crewMember);
        const history = payroll.filter(p => p.crewId === crewMember.id);
        setCrewPayrollHistory(history);
        setIsModalOpen(true);
    };

    const handleGeneratePayslip = (crewMember: CrewMember) => {
        // Mock functionality
        alert(`Generating latest payslip for ${crewMember.name}... (This is a mock action)`);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCrew(null);
        setCrewPayrollHistory([]);
    };

    // Currency formatter
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Payroll Management</h1>
            
            <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">Crew Salary Overview</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 dark:border-muted">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Name</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Rank</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Base Salary (Monthly)</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {crew.map((member: CrewMember) => (
                                <tr key={member.id} className="border-b border-gray-200 dark:border-muted hover:bg-gray-50 dark:hover:bg-muted">
                                    <td className="p-3 flex items-center">
                                        <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full mr-4" />
                                        <span className="font-medium text-gray-900 dark:text-card-foreground">{member.name}</span>
                                    </td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{member.rank}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{formatCurrency(member.salary)}</td>
                                    <td className="p-3">
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleViewHistory(member)} className="p-2 text-gray-400 hover:text-primary-500" aria-label={`View history for ${member.name}`}>
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleGeneratePayslip(member)} className="p-2 text-gray-400 hover:text-green-500" aria-label={`Generate payslip for ${member.name}`}>
                                                <FileTextIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && selectedCrew && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <Card className="w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-card-foreground">Payroll History: {selectedCrew.name}</h2>
                            <button onClick={closeModal} className="p-1 rounded-full text-gray-400 hover:bg-muted">
                                <XIcon className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            {crewPayrollHistory.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="border-b border-gray-200 dark:border-muted">
                                        <tr>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Period</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Base Salary</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Bonus</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Deductions</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Net Pay</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Pay Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {crewPayrollHistory.map(p => (
                                            <tr key={p.id} className="border-b border-gray-200 dark:border-muted last:border-b-0">
                                                <td className="p-3 font-medium text-gray-900 dark:text-card-foreground">{p.period}</td>
                                                <td className="p-3 text-gray-700 dark:text-muted-foreground">{formatCurrency(p.baseSalary)}</td>
                                                <td className="p-3 text-green-500">{formatCurrency(p.bonus)}</td>
                                                <td className="p-3 text-red-500">{formatCurrency(p.deductions)}</td>
                                                <td className="p-3 font-semibold text-gray-900 dark:text-card-foreground">{formatCurrency(p.netPay)}</td>
                                                <td className="p-3 text-gray-700 dark:text-muted-foreground">{p.payDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 dark:text-muted-foreground py-8">No payroll history found for this crew member.</p>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PayrollPage;