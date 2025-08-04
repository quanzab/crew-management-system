



import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { useData } from '../hooks/useData';
import { usePermissions } from '../hooks/usePermissions';
import { Job, JobFormData } from '../types';
import { PencilIcon } from '../components/icons/PencilIcon';
import JobFormModal from '../components/JobFormModal';

const JobAssignmentPage: React.FC = () => {
    const { jobs, crew, vessels, addJob, updateJob } = useData();
    const permissions = usePermissions();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    useEffect(() => {
        if (searchParams.get('action') === 'add' && permissions.canAddJob) {
            handleOpenAddModal();
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, permissions.canAddJob, setSearchParams]);

    const handleOpenAddModal = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (job: Job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (data: JobFormData) => {
        if (editingJob) {
            updateJob({ ...editingJob, ...data });
        } else {
            addJob(data);
        }
        setIsModalOpen(false);
    };
    
    const getAssigneeName = (job: Job) => {
        if (job.assignedTo === 'crew') {
            const crewMember = crew.find(c => c.id === job.assigneeId);
            return crewMember ? `${crewMember.name} (Crew)` : 'Unknown Crew';
        }
        const vessel = vessels.find(v => v.id === job.assigneeId);
        return vessel ? `${vessel.name} (Vessel)` : 'Unknown Vessel';
    };

    const statusColorClass = (status: Job['status']) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Job Assignments</h1>
                 {permissions.canAddJob && (
                    <button onClick={handleOpenAddModal} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Job</button>
                 )}
            </div>
           
            <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">All Jobs</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 dark:border-muted">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Title</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Assigned To</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Status</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Created</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job: Job) => (
                                <tr key={job.id} className="border-b border-gray-200 dark:border-muted hover:bg-gray-50 dark:hover:bg-muted">
                                    <td className="p-3 font-medium text-gray-900 dark:text-card-foreground">{job.title}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{getAssigneeName(job)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorClass(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <div className="flex space-x-2">
                                            {permissions.canEditJob && (
                                                <button onClick={() => handleOpenEditModal(job)} className="p-1 text-gray-400 hover:text-primary-500" aria-label={`Edit ${job.title}`}>
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                            {/* Delete button can be added here if needed */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {isModalOpen && (
                <JobFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingJob}
                />
            )}
        </div>
    );
};

export default JobAssignmentPage;
