



import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { CrewMember, CrewFormData } from '../types';
import { SearchIcon } from '../components/icons/SearchIcon';
import { FilterIcon } from '../components/icons/FilterIcon';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { UserCheckIcon } from '../components/icons/UserCheckIcon';
import { IdCardIcon } from '../components/icons/IdCardIcon';
import { handleAISmartSearch } from '../services/geminiService';
import CrewFormModal from '../components/CrewFormModal';
import CrewIdCardModal from '../components/CrewIdCardModal';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { exportToCsv } from '../services/exportService';

const CrewListPage: React.FC = () => {
    const { crew, vessels, addCrew, updateCrew, deleteCrew } = useData();
    const { loginAs } = useAuth();
    const permissions = usePermissions();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [aiSearchTerm, setAiSearchTerm] = useState('');
    const [aiSearchResult, setAiSearchResult] = useState<string | null>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCrew, setEditingCrew] = useState<CrewMember | null>(null);
    const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
    const [selectedCrewForId, setSelectedCrewForId] = useState<CrewMember | null>(null);

    useEffect(() => {
        if (searchParams.get('action') === 'add' && permissions.canAddCrew) {
            handleOpenAddModal();
            // Clear the search param after triggering the action
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, permissions.canAddCrew, setSearchParams]);

    const filteredCrew = useMemo(() => {
        return crew.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.nationality.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [crew, searchTerm]);

    const onAiSearch = async () => {
        if (!aiSearchTerm) return;
        setIsLoadingAI(true);
        setAiSearchResult(null);
        try {
            const result = await handleAISmartSearch(aiSearchTerm, crew);
            setAiSearchResult(result);
        } catch (error) {
            console.error(error);
            setAiSearchResult('An error occurred while using AI Search.');
        } finally {
            setIsLoadingAI(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingCrew(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (crewMember: CrewMember) => {
        setEditingCrew(crewMember);
        setIsModalOpen(true);
    };

    const handleDeleteCrew = (crewId: string) => {
        if (window.confirm('Are you sure you want to delete this crew member?')) {
            deleteCrew(crewId);
        }
    };

    const handleFormSubmit = (data: CrewFormData) => {
        if (editingCrew) {
            updateCrew({ ...editingCrew, ...data });
        } else {
            addCrew(data);
        }
        setIsModalOpen(false);
    };
    
    const handleLoginAs = (crewId: string) => {
        loginAs(crewId);
        navigate('/ecrew/profile');
    };

    const handleOpenIdCard = (crewMember: CrewMember) => {
        setSelectedCrewForId(crewMember);
        setIsIdCardModalOpen(true);
    };

    const handleExport = () => {
        const headers = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'rank', label: 'Rank' },
            { key: 'nationality', label: 'Nationality' },
            { key: 'status', label: 'Status' },
            { key: 'vesselId', label: 'Assigned Vessel ID' },
            { key: 'vesselName', label: 'Assigned Vessel Name' },
            { key: 'salary', label: 'Salary (USD)' },
        ];
        
        const crewWithVesselName = crew.map(c => ({
            ...c,
            vesselName: vessels.find(v => v.id === c.vesselId)?.name || 'N/A'
        }));
    
        exportToCsv(crewWithVesselName, headers, `CMS_Crew_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Crew Management</h1>

            {permissions.canAccessAIPlanner && (
                 <Card>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">AI-Powered Smart Search</h2>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="e.g., 'Show me all available captains from the Philippines'"
                            value={aiSearchTerm}
                            onChange={(e) => setAiSearchTerm(e.target.value)}
                            className="flex-grow p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground"
                        />
                        <button 
                            onClick={onAiSearch}
                            disabled={isLoadingAI}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed">
                            {isLoadingAI ? 'Thinking...' : 'Ask Gemini'}
                        </button>
                    </div>
                    {aiSearchResult && (
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-muted rounded-md">
                            <h3 className="font-semibold text-gray-900 dark:text-card-foreground">AI Response:</h3>
                            <p className="text-sm text-gray-700 dark:text-muted-foreground whitespace-pre-wrap">{aiSearchResult}</p>
                        </div>
                    )}
                </Card>
            )}

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground">All Crew Members</h2>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search crew..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground"
                            />
                        </div>
                        <button className="p-2 bg-gray-200 dark:bg-muted rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                            <FilterIcon className="h-5 w-5" />
                        </button>
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
                        {permissions.canAddCrew && (
                            <button onClick={handleOpenAddModal} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Crew</button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 dark:border-muted">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Name</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Rank</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Nationality</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Status</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Assigned Vessel</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCrew.map((member: CrewMember) => (
                                <tr key={member.id} className="border-b border-gray-200 dark:border-muted hover:bg-gray-50 dark:hover:bg-muted">
                                    <td className="p-3 flex items-center">
                                        <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full mr-4" />
                                        <span className="font-medium text-gray-900 dark:text-card-foreground">{member.name}</span>
                                    </td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{member.rank}</td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{member.nationality}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            member.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            member.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                            'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-700 dark:text-muted-foreground">{vessels.find(v => v.id === member.vesselId)?.name || 'N/A'}</td>
                                    <td className="p-3">
                                        <div className="flex space-x-1">
                                            <button onClick={() => handleOpenIdCard(member)} className="p-1 text-gray-400 hover:text-blue-500" aria-label={`Generate ID Card for ${member.name}`}>
                                                <IdCardIcon className="h-5 w-5" />
                                            </button>
                                            {permissions.canEditCrew && (
                                                <button onClick={() => handleOpenEditModal(member)} className="p-1 text-gray-400 hover:text-primary-500" aria-label={`Edit ${member.name}`}>
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                            {permissions.canDeleteCrew && (
                                                <button onClick={() => handleDeleteCrew(member.id)} className="p-1 text-gray-400 hover:text-red-500" aria-label={`Delete ${member.name}`}>
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                            {permissions.canLoginAsCrew && (
                                                <button onClick={() => handleLoginAs(member.id)} className="p-1 text-gray-400 hover:text-green-500" aria-label={`Login as ${member.name}`}>
                                                    <UserCheckIcon className="h-5 w-5" />
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
                <CrewFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingCrew}
                />
            )}
            {isIdCardModalOpen && selectedCrewForId && (
                <CrewIdCardModal
                    isOpen={isIdCardModalOpen}
                    onClose={() => setIsIdCardModalOpen(false)}
                    crewMember={selectedCrewForId}
                />
            )}
        </div>
    );
};

export default CrewListPage;
