


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure this import is present
import { useData } from '../hooks/useData';
import { usePermissions } from '../hooks/usePermissions';
import Card from '../components/Card';
import { Appraisal, AppraisalFormData } from '../types';
import { FileTextIcon } from '../components/icons/FileTextIcon';
import AppraisalFormModal from '../components/AppraisalFormModal';

// Custom type for jsPDF with autoTable plugin
type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDFWithAutoTable;
  lastAutoTable: { finalY: number };
};

const AppraisalsPage: React.FC = () => {
    const { appraisals, crew, vessels, addAppraisal } = useData();
    const permissions = usePermissions();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('action') === 'add' && permissions.canAddAppraisal) {
            setIsModalOpen(true);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, permissions.canAddAppraisal, setSearchParams]);

    const handleFormSubmit = (data: AppraisalFormData) => {
        addAppraisal(data);
        setIsModalOpen(false);
    };

    const generatePdf = (appraisal: Appraisal) => {
        const crewMember = crew.find(c => c.id === appraisal.crewMemberId);
        const vessel = vessels.find(v => v.id === appraisal.vesselId);

        if (!crewMember) {
            alert("Could not find crew member to generate report.");
            return;
        }

        const doc = new jsPDF() as jsPDFWithAutoTable;

        // Header
        doc.setFontSize(20);
        doc.text("Seafarer Performance Appraisal Report", 14, 22);
        doc.setFontSize(12);
        doc.text(`Date of Report: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Crew Details Section
        doc.setFontSize(14);
        doc.text("1. Seafarer Details", 14, 45);
        doc.autoTable({
            startY: 50,
            head: [['Name', 'Rank', 'Vessel', 'IMO']],
            body: [[crewMember.name, crewMember.rank, vessel?.name || 'N/A', vessel?.imo || 'N/A']],
            theme: 'grid',
        });

        // Appraisal Details Section
        const finalY = doc.lastAutoTable.finalY || 70;
        doc.setFontSize(14);
        doc.text("2. Appraisal Details", 14, finalY + 15);
        doc.autoTable({
            startY: finalY + 20,
            head: [['Date of Appraisal', 'Assessor']],
            body: [[new Date(appraisal.date).toLocaleDateString(), appraisal.assessor]],
            theme: 'grid'
        });

        // Performance Scores Section
        const finalY2 = doc.lastAutoTable.finalY || 90;
        doc.setFontSize(14);
        doc.text("3. Performance Scores (out of 5)", 14, finalY2 + 15);
        doc.autoTable({
            startY: finalY2 + 20,
            head: [['Competency', 'Score', 'Rating']],
            body: [
                ['Job Performance / Competence', appraisal.performance, `${appraisal.performance}/5`],
                ['Teamwork / Social Skills', appraisal.teamwork, `${appraisal.teamwork}/5`],
                ['Safety Consciousness', appraisal.safety, `${appraisal.safety}/5`],
            ],
            theme: 'grid'
        });

        // Comments Section
        const finalY3 = doc.lastAutoTable.finalY || 130;
        doc.setFontSize(14);
        doc.text("4. Assessor's Comments", 14, finalY3 + 15);
        doc.setFontSize(11);
        const splitComments = doc.splitTextToSize(appraisal.comments, 180);
        doc.text(splitComments, 14, finalY3 + 22);

        // Signature Section
        const finalY4 = finalY3 + 22 + (splitComments.length * 5) + 20;
        doc.setFontSize(12);
        doc.text("_________________________", 14, finalY4 + 10);
        doc.text("Assessor's Signature", 14, finalY4 + 16);
        
        doc.text("_________________________", 130, finalY4 + 10);
        doc.text("Seafarer's Signature", 130, finalY4 + 16);

        doc.save(`Appraisal-Report-${crewMember.name.replace(/ /g, '_')}-${appraisal.date}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Appraisals & Reports</h1>
                 {permissions.canAddAppraisal && (
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Appraisal</button>
                 )}
            </div>
           
            <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-card-foreground mb-4">Completed Appraisals</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 dark:border-muted">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Crew Member</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Rank</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Date</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Assessor</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Overall Score</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appraisals.map((appraisal) => {
                                const crewMember = crew.find(c => c.id === appraisal.crewMemberId);
                                const overallScore = ((appraisal.performance + appraisal.teamwork + appraisal.safety) / 3).toFixed(1);
                                return (
                                    <tr key={appraisal.id} className="border-b border-gray-200 dark:border-muted hover:bg-gray-50 dark:hover:bg-muted">
                                        <td className="p-3 font-medium text-gray-900 dark:text-card-foreground">{crewMember?.name || 'N/A'}</td>
                                        <td className="p-3 text-gray-700 dark:text-muted-foreground">{crewMember?.rank || 'N/A'}</td>
                                        <td className="p-3 text-gray-700 dark:text-muted-foreground">{new Date(appraisal.date).toLocaleDateString()}</td>
                                        <td className="p-3 text-gray-700 dark:text-muted-foreground">{appraisal.assessor}</td>
                                        <td className="p-3 font-semibold text-gray-900 dark:text-card-foreground">{overallScore} / 5.0</td>
                                        <td className="p-3">
                                            <button onClick={() => generatePdf(appraisal)} className="p-2 text-gray-400 hover:text-green-500" aria-label={`Generate PDF for ${crewMember?.name}`}>
                                                <FileTextIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && (
                <AppraisalFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default AppraisalsPage;
