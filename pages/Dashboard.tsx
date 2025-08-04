

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useData } from '../hooks/useData';
import { usePermissions } from '../hooks/usePermissions';
import Card from '../components/Card';
import { KPI } from '../types';
import { UsersIcon } from '../components/icons/UsersIcon';

const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => (
    <Card>
        <h3 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">{kpi.title}</h3>
        <div className="mt-1 flex items-baseline justify-between">
            <p className="text-2xl font-semibold text-gray-900 dark:text-card-foreground">{kpi.value}</p>
            <span className={`text-xs font-medium ${kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change}
            </span>
        </div>
    </Card>
);

const Dashboard: React.FC = () => {
    const { crew, documents, invoices } = useData();
    const permissions = usePermissions();
    const navigate = useNavigate();

    const kpis: KPI[] = useMemo(() => {
        const expiringDocs = documents.filter(doc => {
            const expiry = new Date(doc.expiryDate);
            const today = new Date();
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(today.getDate() + 30);
            return expiry > today && expiry <= thirtyDaysFromNow;
        }).length;
        
        const overdueInvoices = invoices.filter(inv => {
             const dueDate = new Date(inv.dueDate);
             const today = new Date();
             today.setHours(0, 0, 0, 0);
             return dueDate < today && inv.status !== 'Paid';
        }).length;

        return [
            { title: 'Active Crew', value: crew.filter(c => c.status === 'active').length, change: '+2', changeType: 'increase' },
            { title: 'Overdue Invoices', value: overdueInvoices, change: `+${overdueInvoices}`, changeType: 'increase' },
            { title: 'Expiring Docs (30d)', value: expiringDocs, change: `+${expiringDocs}`, changeType: 'increase' },
            { title: 'On Leave', value: crew.filter(c => c.status === 'on-leave').length, change: '-1', changeType: 'decrease' },
        ];
    }, [crew, documents, invoices]);

    const rankDistribution = useMemo(() => {
        const counts = crew.reduce((acc, member) => {
            acc[member.rank] = (acc[member.rank] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [crew]);
    
    const monthlyInvoiceData = useMemo(() => {
        const months: { [key: number]: { name: string, total: number } } = {};
        invoices.forEach(invoice => {
            if (invoice.status !== 'Draft') {
                const date = new Date(invoice.issueDate);
                const monthKey = date.getFullYear() * 100 + date.getMonth();
                const monthName = date.toLocaleString('default', { month: 'short' });

                if (!months[monthKey]) {
                    months[monthKey] = { name: monthName, total: 0 };
                }
                months[monthKey].total += invoice.total;
            }
        });
        
        return Object.keys(months)
            .sort()
            .map(key => months[Number(key)]);

    }, [invoices]);

    const recentAlerts = useMemo(() => {
        const allDocs = crew.flatMap(c => 
            c.documents.map(doc => ({ ...doc, crewName: c.name }))
        );
        const today = new Date();
        return allDocs
            .map(doc => ({
                ...doc,
                daysUntilExpiry: Math.ceil((new Date(doc.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
            }))
            .filter(doc => doc.daysUntilExpiry >= 0)
            .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
            .slice(0, 4);
    }, [crew]);
    
    const standbyCrew = useMemo(() => {
        return crew.filter(c => c.status === 'standby').slice(0, 5); // Limit to 5 for dashboard
    }, [crew]);
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Dashboard</h1>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map(kpi => <KPICard key={kpi.title} kpi={kpi} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">Crew Rank Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={rankDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                labelStyle={{ color: '#f1f5f9' }}
                                formatter={(value: number) => [value, 'Crew']}
                            />
                            <Bar dataKey="value" fill="#06b6d4" name="Number of Crew" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                 <Card>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">Monthly Invoicing Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyInvoiceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} tickFormatter={(value) => `$${value/1000}k`}/>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                labelStyle={{ color: '#f1f5f9' }}
                                formatter={(value: number) => [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value), 'Total Billed']}
                            />
                            <Legend wrapperStyle={{ color: '#f1f5f9' }} />
                            <Line type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={2} name="Total Billed" dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">Recent Alerts</h2>
                    {recentAlerts.length > 0 ? (
                        <ul className="space-y-3">
                            {recentAlerts.map(alert => (
                                 <li key={alert.id} className="text-sm text-yellow-400 flex items-center">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 flex-shrink-0"></span>
                                    <span>{alert.type} for <strong className="mx-1 text-yellow-300">{alert.crewName}</strong> expires in {alert.daysUntilExpiry} days.</span>
                                 </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-green-400">No documents expiring soon. All clear!</p>
                    )}
                </Card>
                {permissions.canAccessCrew && (
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">Newly Available Crew</h2>
                        {standbyCrew.length > 0 ? (
                            <ul className="space-y-3">
                                {standbyCrew.map(member => (
                                    <li 
                                        key={member.id} 
                                        onClick={() => navigate('/crew')} 
                                        className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                                    >
                                        <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                                        <div>
                                            <p className="font-medium text-sm text-card-foreground">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.rank}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8">
                                <UsersIcon className="h-12 w-12 mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-muted-foreground">No crew members are currently on standby.</p>
                            </div>
                        )}
                    </Card>
                )}
             </div>
        </div>
    );
};

export default Dashboard;