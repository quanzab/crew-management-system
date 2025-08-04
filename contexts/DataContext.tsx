


import React, { createContext, useState, useMemo, useCallback } from 'react';
import { CrewMember, Document, Vessel, Payroll, Principal, Appraisal, Job, SurveyorFinding, CrewFormData, VesselFormData, PrincipalFormData, AppraisalFormData, JobFormData, SurveyorFindingFormData, Invoice, InvoiceFormData, DocumentFormData, AuditLog } from '../types';
import { MOCK_CREW, MOCK_DOCUMENTS, MOCK_VESSELS, MOCK_PAYROLL, MOCK_PRINCIPALS, MOCK_APPRAISALS, MOCK_JOBS, MOCK_SURVEYOR_FINDINGS, MOCK_INVOICES } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface DataContextType {
  crew: CrewMember[];
  documents: Document[];
  vessels: Vessel[];
  payroll: Payroll[];
  principals: Principal[];
  appraisals: Appraisal[];
  jobs: Job[];
  surveyorFindings: SurveyorFinding[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  addCrew: (crewMemberData: CrewFormData) => void;
  updateCrew: (crewMember: CrewMember) => void;
  deleteCrew: (crewId: string) => void;
  addVessel: (vesselData: VesselFormData) => void;
  updateVessel: (vessel: Vessel) => void;
  deleteVessel: (vesselId: string) => void;
  addPrincipal: (principalData: PrincipalFormData) => void;
  updatePrincipal: (principal: Principal) => void;
  deletePrincipal: (principalId: string) => void;
  addAppraisal: (appraisalData: AppraisalFormData) => void;
  addJob: (jobData: JobFormData) => void;
  updateJob: (job: Job) => void;
  addSurveyorFinding: (finding: SurveyorFinding) => void;
  addInvoice: (invoiceData: InvoiceFormData) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  addDocumentForCrew: (crewId: string, documentData: DocumentFormData) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authenticatedUser } = useAuth();
  const { addToast } = useToast();
  const [crew, setCrew] = useState<CrewMember[]>(MOCK_CREW);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [vessels, setVessels] = useState<Vessel[]>(MOCK_VESSELS);
  const [payroll, setPayroll] = useState<Payroll[]>(MOCK_PAYROLL);
  const [principals, setPrincipals] = useState<Principal[]>(MOCK_PRINCIPALS);
  const [appraisals, setAppraisals] = useState<Appraisal[]>(MOCK_APPRAISALS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [surveyorFindings, setSurveyorFindings] = useState<SurveyorFinding[]>(MOCK_SURVEYOR_FINDINGS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const logAction = useCallback((action: string, details: string, targetId?: string) => {
    if (!authenticatedUser) return;
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      userId: authenticatedUser.id,
      userName: authenticatedUser.name,
      action,
      details,
      targetId,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [authenticatedUser]);

  const addCrew = useCallback((crewMemberData: CrewFormData) => {
    const newCrewMember: CrewMember = {
      ...crewMemberData,
      id: `C${Date.now()}`,
      documents: [],
      avatarUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/100/100`,
    };
    setCrew(prevCrew => [newCrewMember, ...prevCrew]);
    logAction('CREATE_CREW', `Created new crew member: ${newCrewMember.name}`, newCrewMember.id);
    addToast(`Crew member ${newCrewMember.name} created.`, 'success');
  }, [logAction, addToast]);

  const updateCrew = useCallback((updatedCrewMember: CrewMember) => {
    const originalCrewMember = crew.find(c => c.id === updatedCrewMember.id);
    setCrew(prevCrew => prevCrew.map(c => c.id === updatedCrewMember.id ? updatedCrewMember : c));
    
    if (originalCrewMember && originalCrewMember.status !== updatedCrewMember.status) {
        logAction('UPDATE_CREW_STATUS', `Updated status of crew member ${updatedCrewMember.name} to ${updatedCrewMember.status}`, updatedCrewMember.id);
    } else {
        logAction('UPDATE_CREW', `Updated details for crew member: ${updatedCrewMember.name}`, updatedCrewMember.id);
    }
    addToast(`Updated details for ${updatedCrewMember.name}.`, 'success');
  }, [crew, logAction, addToast]);

  const deleteCrew = useCallback((crewId: string) => {
    const crewToDelete = crew.find(c => c.id === crewId);
    if (crewToDelete) {
      setCrew(prevCrew => prevCrew.filter(c => c.id !== crewId));
      logAction('DELETE_CREW', `Deleted crew member: ${crewToDelete.name} (ID: ${crewId})`);
      addToast(`Deleted crew member: ${crewToDelete.name}.`, 'success');
    }
  }, [crew, logAction, addToast]);

  const addVessel = useCallback((vesselData: VesselFormData) => {
    const newVessel: Vessel = {
        ...vesselData,
        id: `V${Date.now()}`,
    };
    setVessels(prevVessels => [newVessel, ...prevVessels]);
    logAction('CREATE_VESSEL', `Created new vessel: ${newVessel.name}`, newVessel.id);
    addToast(`Vessel ${newVessel.name} created.`, 'success');
  }, [logAction, addToast]);

  const updateVessel = useCallback((updatedVessel: Vessel) => {
    setVessels(prevVessels => prevVessels.map(v => v.id === updatedVessel.id ? updatedVessel : v));
    logAction('UPDATE_VESSEL', `Updated details for vessel: ${updatedVessel.name}`, updatedVessel.id);
    addToast(`Updated details for ${updatedVessel.name}.`, 'success');
  }, [logAction, addToast]);

  const deleteVessel = useCallback((vesselId: string) => {
    const vesselToDelete = vessels.find(v => v.id === vesselId);
    if(vesselToDelete) {
        setVessels(prevVessels => prevVessels.filter(v => v.id !== vesselId));
        logAction('DELETE_VESSEL', `Deleted vessel: ${vesselToDelete.name} (ID: ${vesselId})`);
        addToast(`Deleted vessel: ${vesselToDelete.name}.`, 'success');
    }
  }, [vessels, logAction, addToast]);

  const addPrincipal = useCallback((principalData: PrincipalFormData) => {
    const newPrincipal: Principal = {
        ...principalData,
        id: `P${Date.now()}`,
    };
    setPrincipals(prev => [newPrincipal, ...prev]);
    logAction('CREATE_PRINCIPAL', `Created new principal: ${newPrincipal.name}`, newPrincipal.id);
    addToast(`Principal ${newPrincipal.name} created.`, 'success');
  }, [logAction, addToast]);

  const updatePrincipal = useCallback((updatedPrincipal: Principal) => {
    setPrincipals(prev => prev.map(p => p.id === updatedPrincipal.id ? updatedPrincipal : p));
    logAction('UPDATE_PRINCIPAL', `Updated details for principal: ${updatedPrincipal.name}`, updatedPrincipal.id);
    addToast(`Updated details for ${updatedPrincipal.name}.`, 'success');
  }, [logAction, addToast]);

  const deletePrincipal = useCallback((principalId: string) => {
    const principalToDelete = principals.find(p => p.id === principalId);
    if(principalToDelete) {
        setPrincipals(prev => prev.filter(p => p.id !== principalId));
        logAction('DELETE_PRINCIPAL', `Deleted principal: ${principalToDelete.name} (ID: ${principalId})`);
        addToast(`Deleted principal: ${principalToDelete.name}.`, 'success');
    }
  }, [principals, logAction, addToast]);

  const addAppraisal = useCallback((appraisalData: AppraisalFormData) => {
    const crewMember = crew.find(c => c.id === appraisalData.crewMemberId);
    const newAppraisal: Appraisal = {
      ...appraisalData,
      id: `A${Date.now()}`,
      vesselId: crewMember?.vesselId || null,
    };
    setAppraisals(prev => [newAppraisal, ...prev]);
    logAction('CREATE_APPRAISAL', `Created new appraisal for ${crewMember?.name || 'N/A'}`, newAppraisal.id);
    addToast(`Appraisal for ${crewMember?.name} submitted.`, 'success');
  }, [crew, logAction, addToast]);

  const addJob = useCallback((jobData: JobFormData) => {
    const newJob: Job = {
        ...jobData,
        id: `J${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    setJobs(prev => [newJob, ...prev]);
    logAction('CREATE_JOB', `Created new job: "${newJob.title}"`, newJob.id);
    addToast(`Job "${newJob.title}" created.`, 'success');
  }, [logAction, addToast]);

  const updateJob = useCallback((updatedJob: Job) => {
    const originalJob = jobs.find(j => j.id === updatedJob.id);
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    if (originalJob && originalJob.status !== updatedJob.status) {
        logAction('UPDATE_JOB_STATUS', `Updated status of job "${updatedJob.title}" to ${updatedJob.status}`, updatedJob.id);
        addToast(`Job "${updatedJob.title}" status updated to ${updatedJob.status}.`, 'success');
    } else {
        logAction('UPDATE_JOB', `Updated details for job: "${updatedJob.title}"`, updatedJob.id);
        addToast(`Job "${updatedJob.title}" updated.`, 'success');
    }
  }, [jobs, logAction, addToast]);

  const addSurveyorFinding = useCallback((finding: SurveyorFinding) => {
    setSurveyorFindings(prev => [finding, ...prev]);
    logAction('CREATE_SURVEYOR_FINDING', `Submitted surveyor finding: "${finding.title}"`, finding.id);
    addToast(`Surveyor finding "${finding.title}" submitted.`, 'success');
  }, [logAction, addToast]);
  
  const addInvoice = useCallback((invoiceData: InvoiceFormData) => {
      const subtotal = invoiceData.lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      const taxAmount = subtotal * (invoiceData.taxRate / 100);
      const total = subtotal + taxAmount;

      const newInvoice: Invoice = {
          ...invoiceData,
          id: `INV${Date.now()}`,
          invoiceNumber: `2024-${invoices.length + 1}`,
          status: 'Draft',
          lineItems: invoiceData.lineItems.map((li, index) => ({...li, id: `L-${Date.now()}-${index}`})),
          subtotal,
          taxAmount,
          total
      };
      setInvoices(prev => [newInvoice, ...prev]);
      logAction('CREATE_INVOICE', `Created new invoice #${newInvoice.invoiceNumber}`, newInvoice.id);
      addToast(`Invoice #${newInvoice.invoiceNumber} created.`, 'success');
  }, [invoices.length, logAction, addToast]);

  const updateInvoiceStatus = useCallback((invoiceId: string, status: Invoice['status']) => {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      setInvoices(prev => prev.map(inv => inv.id === invoiceId ? {...inv, status} : inv));
      if (invoice) {
        logAction('UPDATE_INVOICE_STATUS', `Updated status of invoice #${invoice.invoiceNumber} to ${status}`, invoice.id);
        addToast(`Invoice #${invoice.invoiceNumber} status updated to ${status}.`, 'success');
      }
  }, [invoices, logAction, addToast]);

  const addDocumentForCrew = useCallback((crewId: string, documentData: DocumentFormData) => {
    const crewMember = crew.find(c => c.id === crewId);
    const newDocument: Document = {
      ...documentData,
      id: `doc${Date.now()}`,
      documentUrl: '#', // Mock URL
    };
    setDocuments(prev => [newDocument, ...prev]);
    setCrew(prevCrew =>
      prevCrew.map(c =>
        c.id === crewId ? { ...c, documents: [...c.documents, newDocument] } : c
      )
    );
    if (crewMember) {
        logAction('CREATE_DOCUMENT', `Added new document (${newDocument.type}) for crew member ${crewMember.name}`, newDocument.id);
        addToast(`Document "${newDocument.type}" added for ${crewMember.name}.`, 'success');
    }
  }, [crew, logAction, addToast]);

  const value = useMemo(() => ({
    crew,
    documents,
    vessels,
    payroll,
    principals,
    appraisals,
    jobs,
    surveyorFindings,
    invoices,
    auditLogs,
    addCrew,
    updateCrew,
    deleteCrew,
    addVessel,
    updateVessel,
    deleteVessel,
    addPrincipal,
    updatePrincipal,
    deletePrincipal,
    addAppraisal,
    addJob,
    updateJob,
    addSurveyorFinding,
    addInvoice,
    updateInvoiceStatus,
    addDocumentForCrew,
  }), [crew, documents, vessels, payroll, principals, appraisals, jobs, surveyorFindings, invoices, auditLogs, addCrew, updateCrew, deleteCrew, addVessel, updateVessel, deleteVessel, addPrincipal, updatePrincipal, deletePrincipal, addAppraisal, addJob, updateJob, addSurveyorFinding, addInvoice, updateInvoiceStatus, addDocumentForCrew]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};