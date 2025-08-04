


export enum Rank {
  Captain = "Captain",
  ChiefEngineer = "Chief Engineer",
  ChiefOfficer = "Chief Officer",
  SecondEngineer = "Second Engineer",
  ThirdEngineer = "Third Engineer",
  SecondOfficer = "Second Officer",
  ThirdOfficer = "Third Officer",
  Bosun = "Bosun",
  AbleSeaman = "Able Seaman",
  Oiler = "Oiler",
  Cook = "Cook",
}

export interface Document {
  id: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  documentUrl: string; // mock url
}

export interface CrewMember {
  id:string;
  name: string;
  rank: Rank;
  vesselId: string | null;
  nationality: string;
  status: 'active' | 'on-leave' | 'standby';
  documents: Document[];
  avatarUrl: string;
  salary: number;
}

export interface Vessel {
  id: string;
  name: string;
  imo: number;
  type: string;
  location: [number, number]; // [longitude, latitude]
}

export interface Principal {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface Payroll {
  id: string;
  crewId: string;
  period: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  payDate: string;
}

export interface KPI {
    title: string;
    value: string | number;
    change: string;
    changeType: 'increase' | 'decrease';
}

export interface Appraisal {
  id: string;
  crewMemberId: string;
  vesselId: string | null;
  assessor: string;
  date: string;
  performance: number; // score out of 5
  teamwork: number; // score out of 5
  safety: number; // score out of 5
  comments: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  assignedTo: 'crew' | 'vessel';
  assigneeId: string; // CrewMember ID or Vessel ID
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

export interface Attachment {
  name: string;
  type: 'image' | 'pdf';
  dataUrl: string; // base64 data URL
}

export interface SurveyorFinding {
  id: string;
  title: string;
  vesselId: string;
  description: string;
  attachments: Attachment[];
  submittedBy: string;
  submittedAt: string;
  aiSummary: string | null;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  principalId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  taxRate: number; // as a percentage, e.g., 10 for 10%
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface Notification {
  id: string;
  type: 'compliance' | 'billing' | 'appraisal' | 'hr';
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedId?: string; // e.g., invoiceId or crewMemberId
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}


export interface User {
  id: string;
  username: string;
  password?: string; // Only for mock data
  name: string;
  role: 'admin' | 'manager' | 'crewing_officer' | 'crew';
  avatarUrl: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string; // e.g., 'CREATE_CREW', 'UPDATE_VESSEL'
  details: string; // Human-readable description
  targetId?: string; // ID of the entity that was affected
}


export type CrewFormData = Omit<CrewMember, 'id' | 'documents' | 'avatarUrl'>;

export type VesselFormData = Omit<Vessel, 'id'>;

export type PrincipalFormData = Omit<Principal, 'id'>;

export type AppraisalFormData = Omit<Appraisal, 'id' | 'vesselId'>;

export type JobFormData = Omit<Job, 'id' | 'createdAt'>;

export type SurveyorFindingFormData = Omit<SurveyorFinding, 'id' | 'submittedAt' | 'aiSummary'>;

export type InvoiceFormData = Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'subtotal' | 'taxAmount' | 'total' | 'lineItems'> & {
  lineItems: Omit<InvoiceLineItem, 'id'>[];
};

export type DocumentFormData = Omit<Document, 'id' | 'documentUrl'>;

export interface ComplianceIssue {
  crewMemberName: string;
  crewMemberId: string;
  issueType: 'Expired Document' | 'Missing Document';
  documentType: string;
  details: string;
  expiryDate?: string;
}

export interface PlannerRequest {
    vesselId: string;
    ranks: { rank: Rank; quantity: number }[];
}

export interface CrewSuggestion {
    crewMemberName: string;
    crewMemberId: string;
    rank: Rank;
    reasoning: string;
}

export type AIHRAssistantAction = 'summarize' | 'recommendation' | 'verification';

export interface ChangelogChange {
    type: 'Added' | 'Changed' | 'Fixed' | 'Removed' | string;
    items: string[];
}

export interface ChangelogEntry {
    version: string;
    date: string;
    changes: ChangelogChange[];
}

export interface Command {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}
