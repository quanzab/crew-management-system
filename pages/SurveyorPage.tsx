



import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { usePermissions } from '../hooks/usePermissions';
import Card from '../components/Card';
import { SurveyorFinding } from '../types';
import SurveyorFormModal from '../components/SurveyorFormModal';
import { CameraIcon } from '../components/icons/CameraIcon';
import { PdfIcon } from '../components/icons/PdfIcon';

const SurveyorPage: React.FC = () => {
    const { surveyorFindings, vessels } = useData();
    const permissions = usePermissions();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('action') === 'add' && permissions.canSubmitSurveyorFinding) {
            setIsModalOpen(true);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, permissions.canSubmitSurveyorFinding, setSearchParams]);
    
    const getVesselName = (vesselId: string) => {
        return vessels.find(v => v.id === vesselId)?.name || 'Unknown Vessel';
    }

    const FindingCard: React.FC<{ finding: SurveyorFinding }> = ({ finding }) => (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-foreground">{finding.title}</h3>
                    <p className="text-sm text-muted-foreground">
                        Vessel: {getVesselName(finding.vesselId)} | Submitted: {new Date(finding.submittedAt).toLocaleDateString()}
                    </p>
                </div>
                <span className="text-xs text-muted-foreground">{finding.id}</span>
            </div>
            
            {finding.aiSummary && (
                 <div className="mt-4 p-3 bg-primary-950/50 border border-primary-800 rounded-lg">
                    <p className="text-sm font-semibold text-primary-300">AI Summary</p>
                    <p className="text-sm text-primary-400 mt-1">{finding.aiSummary}</p>
                </div>
            )}

            <p className="mt-4 text-sm text-card-foreground">{finding.description}</p>
            
            {finding.attachments && finding.attachments.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-semibold text-card-foreground mb-2">Attachments:</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                        {finding.attachments.map((attachment, index) => (
                            <a href={attachment.dataUrl} target="_blank" rel="noopener noreferrer" key={index} className="group block">
                                {attachment.type === 'image' ? (
                                    <img 
                                        src={attachment.dataUrl} 
                                        alt={attachment.name}
                                        className="w-full h-24 object-cover rounded-md group-hover:opacity-80 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-full h-24 bg-muted rounded-md flex flex-col items-center justify-center p-2 group-hover:bg-gray-600 transition-colors">
                                        <PdfIcon className="w-8 h-8 text-primary-500"/>
                                        <span className="text-xs text-muted-foreground mt-1 text-center w-full truncate">{attachment.name}</span>
                                    </div>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Surveyor Findings</h1>
                 {permissions.canSubmitSurveyorFinding && (
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center">
                        <CameraIcon className="h-5 w-5 mr-2"/>
                        Submit New Finding
                    </button>
                 )}
            </div>

            {surveyorFindings.length > 0 ? (
                <div className="space-y-4">
                    {surveyorFindings.map(finding => <FindingCard key={finding.id} finding={finding} />)}
                </div>
            ) : (
                <Card>
                    <div className="text-center py-12">
                         <CameraIcon className="h-16 w-16 mx-auto text-gray-400" />
                         <h2 className="mt-2 text-xl font-semibold text-card-foreground">No Findings Submitted</h2>
                         <p className="mt-1 text-sm text-muted-foreground">
                            {permissions.canSubmitSurveyorFinding ? 'Click "Submit New Finding" to create the first report.' : 'No findings have been submitted yet.'}
                         </p>
                    </div>
                </Card>
            )}

            {isModalOpen && (
                <SurveyorFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default SurveyorPage;
