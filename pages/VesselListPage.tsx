




import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { usePermissions } from '../hooks/usePermissions';
import Card from '../components/Card';
import FleetMap from '../components/FleetMap';
import { Vessel, VesselFormData } from '../types';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import VesselFormModal from '../components/VesselFormModal';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { exportToCsv } from '../services/exportService';

const VesselListPage: React.FC = () => {
    const { vessels, addVessel, updateVessel, deleteVessel } = useData();
    const permissions = usePermissions();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);

    useEffect(() => {
        if (searchParams.get('action') === 'add' && permissions.canAddVessel) {
            handleOpenAddModal();
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, permissions.canAddVessel, setSearchParams]);

    const handleOpenAddModal = () => {
        setEditingVessel(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (vessel: Vessel) => {
        setEditingVessel(vessel);
        setIsModalOpen(true);
    };

    const handleDeleteVessel = (vesselId: string) => {
        if (window.confirm('Are you sure you want to delete this vessel? This will unassign all crew.')) {
            deleteVessel(vesselId);
        }
    };

    const handleFormSubmit = (data: VesselFormData) => {
        if (editingVessel) {
            updateVessel({ ...editingVessel, ...data });
        } else {
            addVessel(data);
        }
        setIsModalOpen(false);
    };

    const handleExport = () => {
        const headers = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'imo', label: 'IMO' },
            { key: 'type', label: 'Type' },
            { key: 'location.0', label: 'Longitude' },
            { key: 'location.1', label: 'Latitude' },
        ];
        exportToCsv(vessels, headers, `CMS_Vessel_Fleet_${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Fleet Management</h1>
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
                    {permissions.canAddVessel && (
                        <button onClick={handleOpenAddModal} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Vessel</button>
                    )}
                </div>
            </div>
            
            <Card className="!p-0 overflow-hidden">
                <div className="h-[500px] bg-muted flex items-center justify-center">
                   <FleetMap />
                </div>
            </Card>

            <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">Vessel Roster</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 dark:border-muted">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Vessel Name</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">IMO</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Type</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Status</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vessels.map((vessel: Vessel) => (
                                <tr key={vessel.id} className="border-b border-gray-200 dark:border-muted hover:bg-gray-50 dark:hover:bg-muted">
                                    <td className="p-3 font-medium text-gray-900 dark:text-card-foreground">{vessel.name}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{vessel.imo}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{vessel.type}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            In Service
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex space-x-2">
                                            {permissions.canEditVessel && (
                                                <button onClick={() => handleOpenEditModal(vessel)} className="p-1 text-gray-400 hover:text-primary-500" aria-label={`Edit ${vessel.name}`}>
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                            {permissions.canDeleteVessel && (
                                                <button onClick={() => handleDeleteVessel(vessel.id)} className="p-1 text-gray-400 hover:text-red-500" aria-label={`Delete ${vessel.name}`}>
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
                <VesselFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingVessel}
                />
            )}
        </div>
    );
};

export default VesselListPage;
