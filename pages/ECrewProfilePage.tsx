
import React, { useState } from 'react';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Document, DocumentFormData } from '../types';
import DocumentUploadModal from '../components/DocumentUploadModal';

const ECrewProfilePage: React.FC = () => {
    const { currentCrewId } = useAuth();
    const { crew, vessels, addDocumentForCrew } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentUser = crew.find(c => c.id === currentCrewId);
    const assignedVessel = vessels.find(v => v.id === currentUser?.vesselId);
    
    // Correctly get the full document objects associated with the current user.
    const userDocuments = currentUser ? currentUser.documents : [];
    
    const handleDocumentSubmit = (data: DocumentFormData) => {
        if (currentUser) {
            addDocumentForCrew(currentUser.id, data);
        }
        setIsModalOpen(false);
    };

    if (!currentUser) {
        return <p>Loading profile...</p>; // Or redirect
    }
    
    const InfoField: React.FC<{ label: string, value?: string | number | null }> = ({ label, value }) => (
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-muted-foreground">{label}</p>
            <p className="mt-1 text-md text-gray-900 dark:text-card-foreground">{value || 'N/A'}</p>
        </div>
    );
    
    const DocumentRow: React.FC<{ doc: Document }> = ({ doc }) => {
        const isExpired = new Date(doc.expiryDate) < new Date();
        return (
            <tr className="border-b border-gray-200 dark:border-muted hover:bg-gray-50 dark:hover:bg-muted">
                <td className="p-3 font-medium text-gray-900 dark:text-card-foreground">{doc.type}</td>
                <td className="p-3 text-gray-700 dark:text-muted-foreground">{new Date(doc.issueDate).toLocaleDateString()}</td>
                <td className={`p-3 text-gray-700 dark:text-muted-foreground ${isExpired ? 'text-red-500 font-bold' : ''}`}>
                    {new Date(doc.expiryDate).toLocaleDateString()}
                    {isExpired && <span className="ml-2 text-xs">(Expired)</span>}
                </td>
                <td className="p-3">
                    <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">View</a>
                </td>
            </tr>
        )
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Avatar and basic info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center">
                        <img src={currentUser.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary-500" />
                        <h2 className="text-2xl font-bold text-foreground">{currentUser.name}</h2>
                        <p className="text-md text-muted-foreground">{currentUser.rank}</p>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">Personal Details</h3>
                        <div className="space-y-4">
                            <InfoField label="Nationality" value={currentUser.nationality} />
                            <InfoField label="Status" value={currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)} />
                            <InfoField label="Current Vessel" value={assignedVessel?.name} />
                            <InfoField label="IMO Number" value={assignedVessel?.imo} />
                        </div>
                    </Card>
                </div>
                
                {/* Right column: Documents */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-card-foreground">My Documents</h3>
                             <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700">Upload Document</button>
                        </div>
                        <div className="overflow-x-auto">
                           {userDocuments.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="border-b border-gray-200 dark:border-muted">
                                        <tr>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Document Type</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Issue Date</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Expiry Date</th>
                                            <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userDocuments.map(doc => <DocumentRow key={doc.id} doc={doc} />)}
                                    </tbody>
                                </table>
                           ) : (
                                <p className="text-center text-gray-500 dark:text-muted-foreground py-8">You have no documents uploaded.</p>
                           )}
                        </div>
                    </Card>
                </div>
            </div>
            
            {isModalOpen && (
                <DocumentUploadModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleDocumentSubmit}
                />
            )}
        </div>
    );
};

export default ECrewProfilePage;
