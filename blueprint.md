

# Blueprint: Crew Management System (CMS)

This document outlines the architecture, components, and design principles of the Crew Management System (CMS).

## 1. Core Philosophy
- **AI-First**: Leverage Google Gemini for intelligent features like smart search and compliance analysis.
- **Offline-Capable**: Designed to work seamlessly with or without a network connection.
- **Modular**: Built with distinct modules (Crew, Vessel, Payroll) for scalability and maintainability.
- **User-Centric**: A clean, intuitive, and responsive UI/UX is paramount.

## 2. Technology Stack
- **Frontend**: React 18, TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS (with dark/light theme)
- **State Management**: React Context API
- **Charting**: Recharts
- **AI**: `@google/genai` (Gemini)
- **Map**: `react-simple-maps`
- **PDF Generation**: `jspdf` & `jspdf-autotable`

## 3. Core Modules & Features

### Authentication & RBAC
- **Simulated Login**: A new `AuthContext` manages a simulated user session using `localStorage`.
- **Role-Based Access Control (RBAC)**: A comprehensive permission system controls access based on user roles.
    - **Roles**: Admin, Manager, Crewing Officer, Crew.
    - **Permissions Hook**: A `usePermissions` hook centralizes all access logic.
    - **Protected Routes**: Routes in `App.tsx` are wrapped with a `ProtectedRoute` component that checks for both authentication and role-based permissions.
    - **Dynamic UI**: The Sidebar and action buttons (Add, Edit, Delete) are conditionally rendered based on the user's permissions, ensuring users only see and interact with authorized components.
- **"Login As" Feature**: Admins can "Login As" a crew member to enter the eCrew portal.

### What's New Feature
- **Post-Login Updates**: After a user logs in, a "What's New" modal automatically appears to highlight recent updates from the `changelog.md`.
- **Smart Tracking**: The system uses `localStorage` to remember the last version the user has seen, ensuring the modal only shows up when new changes have been deployed.
- **Changelog Service**: A new `changelogService.ts` is responsible for parsing the markdown file to extract version information and changes in a structured format for display.

### Header (Global)
- **Global Search Bar**: Allows users to search across all major data modules (Crew, Vessels, Principals).
- **Real-time Results Panel**: A dropdown panel (`GlobalSearchResults.tsx`) appears as the user types, showing categorized and clickable results.
- **Notifications Center**: A `BellIcon` indicates unread notifications and opens a panel with system-wide alerts. Includes alerts for:
    - Expiring documents
    - Overdue invoices
    - New appraisals
    - Crew members becoming available ('standby')
- **User Profile & Theme**: Displays the logged-in user's information and provides a toggle for light/dark/system themes.

### Global Keyboard Shortcuts
- **Centralized Hook**: A new `useHotkeys` hook provides a declarative, platform-aware way to manage keyboard shortcuts throughout the application.
- **Global Search (`Ctrl+K`)**: Users can press `Ctrl+K` (or `⌘+K` on macOS) from anywhere to immediately focus the global search bar.
- **Visual Hints**: The UI includes visual cues (e.g., `<Kbd>` component) to make shortcuts discoverable.

### Global Toast Notifications
- **Context-Driven**: A new `ToastContext` and `useToast` hook manage the state of toast notifications globally.
- **Action Feedback**: When a user creates, updates, or deletes data, a toast notification appears to confirm the action's success.
- **Styled Toasts**: Notifications are styled based on type (success, error, etc.) and include relevant icons.

### Dashboard (`/dashboard`)
- **Dynamic KPIs**: Displays key metrics like Active Crew, Overdue Invoices, and Expiring Documents.
- **Charts**: Includes `recharts` for Crew Rank Distribution and monthly invoicing trends.
- **Dynamic Alerts**: A section that automatically scans for and displays soon-to-expire documents.
- **Newly Available Crew**: A widget that lists all crew members on 'standby' status, providing managers with a quick view of available personnel.

### AI Crew Planner (`/planner`)
- **Requirement-Based Planning**: A module for managers to input crewing requirements for a vessel.
- **Intelligent Suggestions**: Uses the Gemini API (`handleCrewPlanning`) to analyze available 'standby' crew and suggests best-fit candidates.

### Crew Management (`/crew`)
- **Full CRUD**: Supports Creating, Reading, Updating, and Deleting crew members, governed by RBAC.
- **Crew Roster**: A searchable table view of all crew members.
- **AI Smart Search**: Natural language search powered by Google Gemini.

### Fleet Management (`/vessels`)
- **Full CRUD**: Supports Creating, Reading, Updating, and Deleting vessels, governed by RBAC.
- **Fleet Map**: An interactive world map showing vessel locations.
- **Vessel Roster**: A table listing all vessels with their core data.

### Payroll Management (`/payroll`)
- **Crew Salary Overview**: A table listing all crew members and their base monthly salary.
- **Payroll History**: A modal view to display historical payroll records.

### AI Compliance Analyzer (`/compliance`)
- **Automated Scanning**: Uses AI to scan all crew and document data for compliance issues.
- **Issue Identification**: The AI identifies expired documents and checks for missing mandatory documents.

### Principal Management (`/principals`)
- **Full CRUD**: Supports Creating, Reading,Updating, and Deleting principals, governed by RBAC.
- **Principal Roster**: A table view of all principals with their contact information.

### Appraisals & Reports (`/appraisals`)
- **Performance Appraisals**: A module to create, view, and manage crew performance appraisals.
- **PDF Report Generation**: Client-side generation of professional PDF appraisal reports.

### Job Assignment Module (`/jobs`)
- **Job Creation & Tracking**: A module to create, assign, and track jobs for crew members or vessels.
- **Status Tracking**: Jobs can be assigned a status of 'Pending', 'In Progress', or 'Completed'.

### Surveyor Finding Submission (`/surveyor`)
- **Finding Submission**: A module for surveyors to submit findings.
- **Image & PDF Uploads**: The form supports multiple image and PDF uploads.
- **AI-Powered Summarization**: Uses Gemini API to generate a concise summary of the finding.

### Billing & Invoicing (`/billing`)
- **Invoice Management**: A module to create, track, and manage invoices for principals.
- **PDF Invoice Generation**: Client-side generation of professional PDF invoices.

### Reporting & Analytics (`/reports`)
- **Centralized Reporting Hub**: A dedicated page for generating and downloading reports.
- **Customizable Reports**: Provides options to customize report content (e.g., column selection for the Crew Roster).

### Audit Trail (`/audit-trail`)
- **System-Wide Logging**: Provides a comprehensive, immutable log of all significant actions.
- **User Attribution**: Each log entry is time-stamped and attributed to the logged-in user.
- **Filterable Interface**: The UI provides tools to search and filter the audit trail.

### Data Export
- **CSV Export**: Key data tables (Crew, Vessels, Principals, Invoices) can be exported to CSV format.
- **Export Service**: A centralized `exportService.ts` handles CSV generation and download triggering.
- **Permission-Gated**: Export functionality is controlled by RBAC, available to `admin` and `manager` roles.

### Crew Self-Service Portal (eCrew) (`/ecrew`)
- **Dedicated Layout**: A simplified layout for the seafarer's view.
- **Profile Page**: A read-only page where crew can view their details and document status.
- **Document Upload**: Crew members can upload their own document details.
- **Payroll History**: Allows crew to view their own payroll history.

## 4. UI/UX Style
- **Icons**: The application uses a custom set of minimalist, vector-based SVG icons with a fluid, vibrant green-to-blue gradient.
- **Theme**: A dark-first theme with a light mode option.
- **Layout**: Clean, responsive, and built on a modern card-based design system.

## 5. Project Structure
```
/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── services/
│   ├── layouts/
│   ├── types/
│   ├── data/
│   ├── hooks/
│   │   ├── usePermissions.ts
│   │   ├── useHotkeys.ts
│   ├── App.tsx
│   └── index.tsx
├── blueprint.md
├── changelog.md
└── todo.md
```