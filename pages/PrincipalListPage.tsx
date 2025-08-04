





import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { useData } from '../hooks/useData';
import { usePermissions } from '../hooks/usePermissions';
import { Principal, PrincipalFormData } from '../types';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import PrincipalFormModal from '../components/PrincipalFormModal';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { exportToCsv } from '../services/exportService';

const PrincipalListPage: React.FC = () => {
    const { principals, addPrincipal, updatePrincipal, deletePrincipal } = useData();
    const permissions = usePermissions();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPrincipal, setEditingPrincipal] = useState<Principal | null>(null);

    useEffect(() => {
        if (searchParams.get('action') === 'add' && permissions.canAddPrincipal) {
            handleOpenAddModal();
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, permissions.canAddPrincipal, setSearchParams]);

    const handleOpenAddModal = () => {
        setEditingPrincipal(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (principal: Principal) => {
        setEditingPrincipal(principal);
        setIsModalOpen(true);
    };

    const handleDeletePrincipal = (principalId: string) => {
        if (window.confirm('Are you sure you want to delete this principal?')) {
            deletePrincipal(principalId);
        }
    };

    const handleFormSubmit = (data: PrincipalFormData) => {
        if (editingPrincipal) {
            updatePrincipal({ ...editingPrincipal, ...data });
        } else {
            addPrincipal(data);
        }
        setIsModalOpen(false);
    };

    const handleExport = () => {
        const headers = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Company Name' },
            { key: 'contactPerson', label: 'Contact Person' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'address', label: 'Address' },
        ];
        exportToCsv(principals, headers, `CMS_Principals_${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Principal Management</h1>
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
                    {permissions.canAddPrincipal && (
                        <button onClick={handleOpenAddModal} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Principal</button>
                    )}
                 </div>
            </div>
           
            <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">All Principals</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 dark:border-muted">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Company Name</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Contact Person</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Email</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Phone</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {principals.map((principal: Principal) => (
                                <tr key={principal.id} className="border-b border-gray-200 dark:border-muted hover:bg-gray-50 dark:hover:bg-muted">
                                    <td className="p-3 font-medium text-gray-900 dark:text-card-foreground">{principal.name}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{principal.contactPerson}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{principal.email}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{principal.phone}</td>
                                    <td className="p-3">
                                        <div className="flex space-x-2">
                                            {permissions.canEditPrincipal && (
                                                <button onClick={() => handleOpenEditModal(principal)} className="p-1 text-gray-400 hover:text-primary-500" aria-label={`Edit ${principal.name}`}>
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                            {permissions.canDeletePrincipal && (
                                                <button onClick={() => handleDeletePrincipal(principal.id)} className="p-1 text-gray-400 hover:text-red-500" aria-label={`Delete ${principal.name}`}>
                                                    <TrashIcon className="h-5 w-5" />
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
                <PrincipalFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingPrincipal}
                />
            )}
        </div>
    );
};

export default PrincipalListPage;
