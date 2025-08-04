

import { CrewMember, Document, Rank, Vessel, Payroll, Principal, Appraisal, Job, SurveyorFinding, Invoice } from '../types';

export const MOCK_DOCUMENTS: Document[] = [
  { id: 'doc1', type: 'Passport', issueDate: '2020-01-15', expiryDate: '2030-01-14', documentUrl: '#' },
  { id: 'doc2', type: 'Seaman\'s Book', issueDate: '2019-05-20', expiryDate: '2029-05-19', documentUrl: '#' },
  { id: 'doc3', type: 'Medical Certificate', issueDate: '2023-11-10', expiryDate: '2024-11-09', documentUrl: '#' },
  { id: 'doc4', type: 'US Visa', issueDate: '2021-08-01', expiryDate: '2026-07-31', documentUrl: '#' },
  { id: 'doc5', type: 'Passport', issueDate: '2018-03-22', expiryDate: '2028-03-21', documentUrl: '#' },
  { id: 'doc6', type: 'Medical Certificate', issueDate: '2024-06-01', expiryDate: '2025-05-31', documentUrl: '#' },
];

export const MOCK_CREW: CrewMember[] = [
  { id: 'C001', name: 'John Doe', rank: Rank.Captain, vesselId: 'V001', nationality: 'American', status: 'active', documents: [MOCK_DOCUMENTS[0], MOCK_DOCUMENTS[2]], avatarUrl: 'https://picsum.photos/id/1005/100/100', salary: 12000 },
  { id: 'C002', name: 'Jane Smith', rank: Rank.ChiefEngineer, vesselId: 'V001', nationality: 'Filipino', status: 'active', documents: [], avatarUrl: 'https://picsum.photos/id/1011/100/100', salary: 9500 },
  { id: 'C003', name: 'Peter Jones', rank: Rank.ChiefOfficer, vesselId: 'V002', nationality: 'British', status: 'active', documents: [MOCK_DOCUMENTS[4]], avatarUrl: 'https://picsum.photos/id/1012/100/100', salary: 8000 },
  { id: 'C004', name: 'Maria Garcia', rank: Rank.SecondEngineer, vesselId: 'V002', nationality: 'Spanish', status: 'on-leave', documents: [], avatarUrl: 'https://picsum.photos/id/1027/100/100', salary: 7200 },
  { id: 'C005', name: 'Chen Wei', rank: Rank.AbleSeaman, vesselId: 'V001', nationality: 'Chinese', status: 'active', documents: [], avatarUrl: 'https://picsum.photos/id/1040/100/100', salary: 3500 },
  { id: 'C006', name: 'Ahmed Khan', rank: Rank.Oiler, vesselId: null, nationality: 'Pakistani', status: 'standby', documents: [], avatarUrl: 'https://picsum.photos/id/1045/100/100', salary: 3000 },
  { id: 'C007', name: 'Olga Petrova', rank: Rank.Cook, vesselId: 'V003', nationality: 'Russian', status: 'active', documents: [], avatarUrl: 'https://picsum.photos/id/1062/100/100', salary: 4000 },
  { id: 'C008', name: 'Juan Dela Cruz', rank: Rank.Captain, vesselId: null, nationality: 'Filipino', status: 'standby', documents: [], avatarUrl: 'https://picsum.photos/id/20/100/100', salary: 12500 },
  { id: 'C009', name: 'David Miller', rank: Rank.Bosun, vesselId: null, nationality: 'Australian', status: 'standby', documents: [MOCK_DOCUMENTS[5]], avatarUrl: 'https://picsum.photos/id/30/100/100', salary: 4500 },
];

export const MOCK_VESSELS: Vessel[] = [
  { id: 'V001', name: 'Ocean Explorer', imo: 9876543, type: 'Container Ship', location: [-74.0060, 40.7128] },
  { id: 'V002', name: 'Sea Serpent', imo: 1234567, type: 'Bulk Carrier', location: [114.1694, 22.3193] },
  { id: 'V003', name: 'Arctic Voyager', imo: 7654321, type: 'LNG Tanker', location: [4.8952, 52.3702] },
  { id: 'V004', name: 'Pacific Queen', imo: 1122334, type: 'Crude Oil Tanker', location: [139.6917, 35.6895] },
];

export const MOCK_PRINCIPALS: Principal[] = [
    { id: 'P001', name: 'Global Shipping Inc.', contactPerson: 'Alice Johnson', email: 'alice.j@globalship.com', phone: '+1-202-555-0171', address: '123 Maritime Ave, New York, USA' },
    { id: 'P002', name: 'Oceanic Carriers Ltd.', contactPerson: 'Bob Williams', email: 'bob.w@oceanic.com', phone: '+44-20-7946-0958', address: '456 Port Road, London, UK' },
    { id: 'P003', name: 'Asia Pacific Liners', contactPerson: 'Charles Chen', email: 'c.chen@asiapacific.sg', phone: '+65-6329-5888', address: '789 Harbour St, Singapore' },
];

export const MOCK_PAYROLL: Payroll[] = [
    { id: 'P001', crewId: 'C001', period: 'April 2024', baseSalary: 12000, bonus: 500, deductions: 250, netPay: 12250, payDate: '2024-04-30' },
    { id: 'P002', crewId: 'C001', period: 'March 2024', baseSalary: 12000, bonus: 0, deductions: 250, netPay: 11750, payDate: '2024-03-31' },
    { id: 'P003', crewId: 'C002', period: 'April 2024', baseSalary: 9500, bonus: 0, deductions: 180, netPay: 9320, payDate: '2024-04-30' },
    { id: 'P004', crewId: 'C003', period: 'April 2024', baseSalary: 8000, bonus: 200, deductions: 150, netPay: 8050, payDate: '2024-04-30' },
    { id: 'P005', crewId: 'C004', period: 'April 2024', baseSalary: 7200, bonus: 0, deductions: 140, netPay: 7060, payDate: '2024-04-30' },
    { id: 'P006', crewId: 'C008', period: 'April 2024', baseSalary: 12500, bonus: 1000, deductions: 300, netPay: 13200, payDate: '2024-04-30' },
    { id: 'P007', crewId: 'C008', period: 'March 2024', baseSalary: 12500, bonus: 0, deductions: 300, netPay: 12200, payDate: '2024-03-31' },
];

export const MOCK_APPRAISALS: Appraisal[] = [
  { id: 'A001', crewMemberId: 'C001', vesselId: 'V001', assessor: 'Admin User', date: '2024-05-15', performance: 5, teamwork: 4, safety: 5, comments: 'Captain Doe continues to show exemplary leadership and adherence to safety protocols. Consistently exceeds expectations.'},
  { id: 'A002', crewMemberId: 'C003', vesselId: 'V002', assessor: 'Admin User', date: '2024-05-10', performance: 4, teamwork: 5, safety: 4, comments: 'Excellent teamwork and communication skills. Proactive in identifying potential issues on the bridge.'},
  { id: 'A005', crewMemberId: 'C005', vesselId: 'V001', assessor: 'Admin User', date: '2024-05-20', performance: 3, teamwork: 4, safety: 3, comments: 'Shows good potential. Needs to improve on response time during safety drills. Overall a satisfactory performance.'},
];

export const MOCK_JOBS: Job[] = [
    { id: 'J001', title: 'Inspect Lifeboat Davits', description: 'Perform mandatory quarterly inspection of all lifeboat davits on board.', assignedTo: 'vessel', assigneeId: 'V001', status: 'In Progress', createdAt: '2024-06-02T10:00:00Z' },
    { id: 'J002', title: 'Update Navigation Charts', description: 'Update all electronic and paper charts for the upcoming voyage to Rotterdam.', assignedTo: 'crew', assigneeId: 'C003', status: 'Pending', createdAt: '2024-06-01T14:30:00Z' },
    { id: 'J003', title: 'Main Engine Overhaul', description: 'Complete the 5000-hour service for the main engine as per the manufacturer\'s specification.', assignedTo: 'crew', assigneeId: 'C002', status: 'Completed', createdAt: '2024-05-28T08:00:00Z' },
    { id: 'J004', title: 'Restock Medical Supplies', description: 'Inventory all medical supplies and restock necessary items before departure.', assignedTo: 'vessel', assigneeId: 'V004', status: 'Pending', createdAt: '2024-06-03T11:00:00Z' }
];

export const MOCK_SURVEYOR_FINDINGS: SurveyorFinding[] = [];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV001',
    principalId: 'P001',
    invoiceNumber: '2024-001',
    issueDate: '2024-05-15',
    dueDate: '2024-06-14',
    lineItems: [
      { id: 'L1-1', description: 'Crew Management Fee - May 2024', quantity: 1, unitPrice: 5000 },
      { id: 'L1-2', description: 'Payroll Processing Fee', quantity: 1, unitPrice: 500 },
    ],
    taxRate: 10,
    status: 'Paid',
    subtotal: 5500,
    taxAmount: 550,
    total: 6050,
  },
  {
    id: 'INV002',
    principalId: 'P002',
    invoiceNumber: '2024-002',
    issueDate: '2024-05-20',
    dueDate: '2024-05-30',
    lineItems: [
      { id: 'L2-1', description: 'Vessel "Sea Serpent" Manning Fee', quantity: 1, unitPrice: 8000 },
    ],
    taxRate: 0,
    status: 'Sent',
    subtotal: 8000,
    taxAmount: 0,
    total: 8000,
  },
   {
    id: 'INV003',
    principalId: 'P003',
    invoiceNumber: '2024-003',
    issueDate: '2024-06-01',
    dueDate: '2024-07-01',
    lineItems: [
      { id: 'L3-1', description: 'Consulting Services', quantity: 10, unitPrice: 150 },
      { id: 'L3-2', description: 'Travel Expenses Reimbursement', quantity: 1, unitPrice: 450 },
    ],
    taxRate: 5,
    status: 'Draft',
    subtotal: 1950,
    taxAmount: 97.5,
    total: 2047.5,
  }
];