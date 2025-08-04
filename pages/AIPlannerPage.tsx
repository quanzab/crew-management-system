
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import Card from '../components/Card';
import { Rank, PlannerRequest, CrewSuggestion } from '../types';
import { handleCrewPlanning } from '../services/geminiService';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { TrashIcon } from '../components/icons/TrashIcon';

const inputClass = "w-full p-2 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1";

const AIPlannerPage: React.FC = () => {
    const { vessels, crew } = useData();
    const [request, setRequest] = useState<PlannerRequest>({
        vesselId: vessels[0]?.id || '',
        ranks: [{ rank: Rank.Captain, quantity: 1 }],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<CrewSuggestion[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRankChange = (index: number, field: 'rank' | 'quantity', value: string | number) => {
        const newRanks = [...request.ranks];
        if (field === 'quantity') {
            newRanks[index][field] = Number(value) > 0 ? Number(value) : 1;
        } else {
            newRanks[index][field] = value as Rank;
        }
        setRequest(prev => ({ ...prev, ranks: newRanks }));
    };

    const addRankRequirement = () => {
        setRequest(prev => ({
            ...prev,
            ranks: [...prev.ranks, { rank: Rank.AbleSeaman, quantity: 1 }],
        }));
    };

    const removeRankRequirement = (index: number) => {
        if (request.ranks.length <= 1) return; // Must have at least one requirement
        setRequest(prev => ({
            ...prev,
            ranks: prev.ranks.filter((_, i) => i !== index),
        }));
    };

    const findCrew = async () => {
        if (!request.vesselId) {
            setError("Please select a vessel.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuggestions(null);
        try {
            const availableCrew = crew.filter(c => c.status === 'standby');
            const results = await handleCrewPlanning(request, availableCrew);
            setSuggestions(results);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred during AI planning.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const SuggestionCard: React.FC<{ suggestion: CrewSuggestion }> = ({ suggestion }) => {
        const crewMember = crew.find(c => c.id === suggestion.crewMemberId);
        if (!crewMember) return null;

        return (
             <Card className="flex items-start gap-4">
                <img src={crewMember.avatarUrl} alt={crewMember.name} className="w-16 h-16 rounded-full border-2 border-primary-500" />
                <div className="flex-grow">
                    <p className="font-bold text-lg text-foreground">{crewMember.name}</p>
                    <p className="text-sm text-muted-foreground">{crewMember.rank} | {crewMember.nationality}</p>
                    <div className="mt-2 p-2 bg-muted/50 rounded-md">
                        <p className="text-xs font-semibold text-primary-400">AI Reasoning:</p>
                        <p className="text-sm text-card-foreground italic">"{suggestion.reasoning}"</p>
                    </div>
                </div>
            </Card>
        )
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">AI Crew Planner</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-lg font-semibold text-card-foreground mb-4">Crewing Requirements</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="vesselId" className={labelClass}>Target Vessel</label>
                                <select id="vesselId" name="vesselId" value={request.vesselId} onChange={(e) => setRequest(p => ({...p, vesselId: e.target.value}))} className={inputClass}>
                                    {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className={labelClass}>Ranks Needed</label>
                                <div className="space-y-2">
                                    {request.ranks.map((r, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <select value={r.rank} onChange={(e) => handleRankChange(index, 'rank', e.target.value)} className={inputClass}>
                                                {Object.values(Rank).map(rank => <option key={rank} value={rank}>{rank}</option>)}
                                            </select>
                                            <input type="number" value={r.quantity} onChange={(e) => handleRankChange(index, 'quantity', e.target.value)} className={`${inputClass} w-20 text-center`} min="1" />
                                            <button onClick={() => removeRankRequirement(index)} className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50" disabled={request.ranks.length <= 1}>
                                                <TrashIcon className="h-5 w-5"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addRankRequirement} className="mt-2 text-sm text-primary-500 hover:text-primary-600 font-semibold">+ Add Rank</button>
                            </div>

                            <button onClick={findCrew} disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed">
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                {isLoading ? 'Planning...' : 'Find Best Crew'}
                            </button>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-lg font-semibold text-card-foreground mb-4">AI Suggestions</h2>
                        {isLoading && <p className="text-center text-muted-foreground animate-pulse py-12">AI is analyzing available crew...</p>}
                        {error && <p className="text-center text-red-500 py-12">{error}</p>}
                        
                        {!isLoading && !error && suggestions === null && (
                            <div className="text-center py-12">
                                <SparklesIcon className="h-16 w-16 mx-auto text-gray-400" />
                                <h3 className="mt-2 text-xl font-semibold text-card-foreground">Ready to Plan</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Fill in the requirements and let AI find the best crew for the job.</p>
                            </div>
                        )}

                        {!isLoading && !error && suggestions && (
                            suggestions.length > 0 ? (
                                <div className="space-y-4">
                                    {suggestions.map(s => <SuggestionCard key={s.crewMemberId} suggestion={s} />)}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-semibold text-card-foreground">No Suggestions Found</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">The AI could not find suitable standby crew for the requested ranks. Try adjusting your requirements or check crew availability.</p>
                                </div>
                            )
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIPlannerPage;