
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import Card from '../components/Card';
import { handleAIHRAssistant } from '../services/geminiService';
import { CrewMember, AIHRAssistantAction } from '../types';
import { RobotIcon } from '../components/icons/RobotIcon';

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const AIHRAssistantPage: React.FC = () => {
    const { crew, appraisals } = useData();
    const [selectedCrewId, setSelectedCrewId] = useState<string>(crew[0]?.id || '');
    const [action, setAction] = useState<AIHRAssistantAction>('summarize');
    const [isLoading, setIsLoading] = useState(false);
    const [resultText, setResultText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const selectedCrew = useMemo(() => crew.find(c => c.id === selectedCrewId), [crew, selectedCrewId]);

    const handleGenerate = async () => {
        if (!selectedCrew) {
            setError("Please select a crew member.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultText('');
        try {
            const crewAppraisals = appraisals.filter(a => a.crewMemberId === selectedCrew.id);
            const result = await handleAIHRAssistant(selectedCrew, crewAppraisals, action);
            setResultText(result);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">AI HR Assistant</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Controls */}
                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-lg font-semibold text-card-foreground mb-4">Select Task</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="crew-select" className={labelClass}>Crew Member</label>
                                <select 
                                    id="crew-select" 
                                    className={inputClass} 
                                    value={selectedCrewId}
                                    onChange={(e) => setSelectedCrewId(e.target.value)}
                                >
                                    {crew.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="action-select" className={labelClass}>Action</label>
                                <select 
                                    id="action-select" 
                                    className={inputClass}
                                    value={action}
                                    onChange={(e) => setAction(e.target.value as AIHRAssistantAction)}
                                >
                                    <option value="summarize">Summarize History</option>
                                    <option value="recommendation">Generate Letter of Recommendation</option>
                                    <option value="verification">Generate Employment Verification</option>
                                </select>
                            </div>
                             <button onClick={handleGenerate} disabled={isLoading || !selectedCrewId} className="w-full flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed">
                                <RobotIcon className="h-5 w-5 mr-2" />
                                {isLoading ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Result */}
                <div className="lg:col-span-2">
                    <Card className="min-h-[400px] flex flex-col">
                        <h2 className="text-lg font-semibold text-card-foreground mb-4">Generated Document</h2>
                        {isLoading && (
                            <div className="flex-grow flex items-center justify-center text-center">
                                <p className="text-lg text-muted-foreground animate-pulse">AI is writing, please wait...</p>
                            </div>
                        )}
                        {error && (
                            <div className="flex-grow flex items-center justify-center text-center">
                                <p className="text-lg text-red-500">{error}</p>
                            </div>
                        )}
                        {!isLoading && !error && !resultText && (
                            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                                <RobotIcon className="h-16 w-16 mx-auto text-gray-400" />
                                <h3 className="mt-2 text-xl font-semibold text-card-foreground">Ready to Assist</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Select a crew member and an action, then click "Generate with AI" to get started.</p>
                            </div>
                        )}
                        {!isLoading && !error && resultText && (
                            <div className="bg-muted p-4 rounded-md h-full flex-grow overflow-y-auto">
                               <pre className="text-sm text-card-foreground whitespace-pre-wrap font-sans">
                                   {resultText}
                               </pre>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIHRAssistantPage;
