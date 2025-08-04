
import React, { useState } from 'react';
import Card from '../components/Card';
import { useData } from '../hooks/useData';
import { handleComplianceAnalysis } from '../services/geminiService';
import { ComplianceIssue } from '../types';
import { ShieldIcon } from '../components/icons/ShieldIcon';

const CompliancePage: React.FC = () => {
    const { crew, documents } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ComplianceIssue[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const results = await handleComplianceAnalysis(crew, documents);
            setAnalysisResult(results);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const IssueCard: React.FC<{ issue: ComplianceIssue }> = ({ issue }) => (
        <Card className={`border-l-4 ${issue.issueType === 'Expired Document' ? 'border-red-500' : 'border-yellow-500'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-foreground">{issue.crewMemberName}</p>
                    <p className="text-sm text-muted-foreground">ID: {issue.crewMemberId}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    issue.issueType === 'Expired Document' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                    {issue.issueType}
                </span>
            </div>
            <div className="mt-4">
                <p><span className="font-semibold text-card-foreground">Document:</span> <span className="text-muted-foreground">{issue.documentType}</span></p>
                {issue.expiryDate && (
                    <p><span className="font-semibold text-card-foreground">Expiry Date:</span> <span className="text-muted-foreground">{issue.expiryDate}</span></p>
                )}
                <p className="mt-2 text-sm text-card-foreground">{issue.details}</p>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">AI Compliance Analyzer</h1>
                <button
                    onClick={runAnalysis}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors"
                >
                    <ShieldIcon className="h-5 w-5 mr-2" />
                    {isLoading ? 'Analyzing...' : 'Run Compliance Analysis'}
                </button>
            </div>

            <Card>
                <div className="text-center">
                    {isLoading && <p className="text-lg text-muted-foreground animate-pulse">AI is checking records...</p>}
                    {error && <p className="text-lg text-red-500">{error}</p>}

                    {!isLoading && !error && analysisResult === null && (
                        <div className="text-center py-8">
                             <ShieldIcon className="h-16 w-16 mx-auto text-gray-400" />
                             <h2 className="mt-2 text-xl font-semibold text-card-foreground">Ready to Scan</h2>
                             <p className="mt-1 text-sm text-muted-foreground">Click "Run Compliance Analysis" to check all crew documents for issues.</p>
                        </div>
                    )}
                    
                    {!isLoading && !error && analysisResult !== null && (
                        <div>
                            {analysisResult.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShieldIcon className="h-16 w-16 mx-auto text-green-500" />
                                    <h2 className="mt-2 text-xl font-semibold text-card-foreground">All Clear!</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">No compliance issues were found for any crew members.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-card-foreground text-left">Analysis Complete: Found {analysisResult.length} issue(s)</h2>
                                    {analysisResult.map((issue, index) => (
                                        <IssueCard key={index} issue={issue} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CompliancePage;
