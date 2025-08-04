
import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { useData } from '../hooks/useData';
import { AuditLog } from '../types';
import { HistoryIcon } from '../components/icons/HistoryIcon';
import { SearchIcon } from '../components/icons/SearchIcon';

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const AuditTrailPage: React.FC = () => {
    const { auditLogs } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredLogs = useMemo(() => {
        return auditLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && logDate < start) return false;
            // Add 1 day to end date to make it inclusive
            if (end) {
                const inclusiveEndDate = new Date(end);
                inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
                if (logDate > inclusiveEndDate) return false;
            }

            const lowerCaseSearch = searchTerm.toLowerCase();
            return (
                log.userName.toLowerCase().includes(lowerCaseSearch) ||
                log.action.toLowerCase().includes(lowerCaseSearch) ||
                log.details.toLowerCase().includes(lowerCaseSearch)
            );
        });
    }, [auditLogs, searchTerm, startDate, endDate]);

    const LogItem: React.FC<{ log: AuditLog }> = ({ log }) => (
        <div className="flex items-start gap-4 p-4 border-b border-muted last:border-b-0">
            <div className="mt-1">
                <HistoryIcon className="w-5 h-5 text-primary-500" />
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-card-foreground">
                    <span className="font-bold text-accent">{log.userName}</span> performed action: <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{log.action}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
            </div>
            <div className="flex-shrink-0 text-right">
                 <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">System Audit Trail</h1>
            
            <Card>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative md:col-span-1">
                         <label htmlFor="search" className={labelClass}>Search Logs</label>
                         <SearchIcon className="absolute left-3 top-10 -translate-y-1/2 h-5 w-5 text-gray-400" />
                         <input
                            type="text"
                            id="search"
                            placeholder="Search by user, action, or details..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`${inputClass} pl-10`}
                        />
                    </div>
                     <div>
                        <label htmlFor="start-date" className={labelClass}>Start Date</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="end-date" className={labelClass}>End Date</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
                    </div>
                 </div>
            </Card>

            <Card>
                <div className="divide-y divide-muted -m-6">
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map(log => <LogItem key={log.id} log={log} />)
                    ) : (
                        <div className="text-center p-12">
                            <HistoryIcon className="h-16 w-16 mx-auto text-gray-400" />
                            <h2 className="mt-2 text-xl font-semibold text-card-foreground">No Logs Found</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {auditLogs.length > 0 ? 'Try adjusting your filters.' : 'No actions have been logged yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AuditTrailPage;
