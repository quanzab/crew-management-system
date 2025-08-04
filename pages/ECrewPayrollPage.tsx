
import React from 'react';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Payroll } from '../types';

const ECrewPayrollPage: React.FC = () => {
    const { currentCrewId } = useAuth();
    const { payroll } = useData();
    
    const crewPayrollHistory = payroll.filter(p => p.crewId === currentCrewId);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">My Payroll History</h1>

            <Card>
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
                                {crewPayrollHistory.map((p: Payroll) => (
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
                        <p className="text-center text-gray-500 dark:text-muted-foreground py-8">No payroll history found.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ECrewPayrollPage;
