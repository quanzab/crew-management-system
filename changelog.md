# Changelog

All notable changes to this project will be documented in this file.

## [1.25.0] - 2024-06-26

### Added
- **Fuzzy Search**: Implemented a more powerful fuzzy search algorithm in the command palette for more intuitive and relevant results.
- **Recently Used Commands**: The command palette now remembers and displays your 5 most recently used commands for quick re-use.

### Changed
- **Search Highlighting**: Command palette results now highlight the matched characters, providing clear visual feedback on why a result is shown.

## [1.24.0] - 2024-06-25

### Added
- **Global Command Palette**: Implemented a new command palette, accessible via `Ctrl+P` (or `⌘+P`), for quick navigation and actions.
- **Quick Actions**: The palette allows users to instantly navigate to any page, initiate actions like adding crew or creating invoices, toggle the theme, and log out.
- **Context-Aware Commands**: The available commands are dynamically filtered based on the user's role and permissions.
- **New Icons**: Added `CommandIcon` and `PlusCircleIcon` to support the new UI.

## [1.23.0] - 2024-06-24

### Added
- **Help & Support Widget**: Implemented a new floating widget on all main pages to provide users with quick access to help resources.
- **Quick Links**: The new widget includes links for documentation, changelog, contacting support, and submitting feedback.

## [1.22.0] - 2024-06-23

### Added
- **What's New Modal**: Implemented a new "What's New" modal that appears after login to inform users about the latest features and updates from the changelog.
- **Last Seen Version Tracking**: The system now tracks the last changelog version viewed by the user in `localStorage` to ensure the modal only appears when there are new updates.

### Changed
- The `AuthContext` now orchestrates showing the "What's New" modal post-login.

## [1.21.0] - 2024-06-22

### Added
- **Global Toast Notifications**: Implemented a global toast notification system to provide immediate, non-intrusive feedback for user actions.
- **Action Confirmation**: When users create, update, or delete data (e.g., adding a crew member, updating a vessel), a confirmation toast now appears.
- **New Context & Hook**: Added `ToastContext.tsx` and a `useToast` hook to manage toast state globally.
- **New Components**: Created `ToastContainer.tsx` and `Toast.tsx` to render notifications, with support for different styles (success, error) and icons.

## [1.20.0] - 2024-06-21

### Added
- **Global Keyboard Shortcuts**: Implemented a new system for global hotkeys to improve user efficiency.
- **New Hook**: Added `useHotkeys.ts` to provide a declarative and platform-aware way to manage keyboard shortcuts.
- **Ctrl+K for Search**: Users can now press `Ctrl+K` (or `⌘+K` on macOS) to instantly focus the global search bar in the header.
- **New Component**: Added a `<Kbd>` component to visually display keyboard shortcuts in the UI.

## [1.19.0] - 2024-06-20

### Added
- **Newly Available Crew Widget**: Implemented a new widget on the Dashboard that provides a quick-view list of all crew members with a 'standby' status, allowing managers to easily see who is available for assignment. The widget is visible to users with appropriate permissions.

## [1.18.0] - 2024-06-19

### Added
- **HR Notifications**: Implemented a new notification type for HR-related events. The system now generates an alert when a crew member's status changes to 'standby', making them available for assignment.
- **HR Alert Preference**: Added a new toggle in the Settings page to allow users to enable or disable HR-related notifications.

### Changed
- **Enhanced Audit Logging**: The `updateCrew` function now creates a more specific audit log entry when a crew member's status is changed, improving traceability for notifications.

## [1.17.0] - 2024-06-18

### Added
- **Data Export Feature**: Implemented a "Export to CSV" functionality on the Crew, Vessels, Principals, and Billing pages.
- **Export Service**: Created a new `exportService.ts` to handle the conversion of data to CSV format and trigger downloads.
- **New Icon**: Added `DownloadIcon.tsx` for the export buttons.
- **Permission-Gated Exports**: The ability to export data is restricted to users with appropriate permissions (Admin, Manager).

## [1.16.0] - 2024-06-17

### Added
- **Role-Based Access Control (RBAC)**: Implemented a comprehensive RBAC system to control user access based on roles (Admin, Manager, Crewing Officer, Crew).
- **New User Roles**: Defined granular permissions for each role, restricting access to specific pages and actions.
- **Permissions Hook**: Created a new `usePermissions` hook to centralize and manage permission logic throughout the application.
- **Role-Protected Routes**: Enhanced the `ProtectedRoute` component to check for `allowedRoles`, securing application routes based on user permissions.
- **Dynamic UI**: The application UI, including the sidebar and action buttons (Add, Edit, Delete), now dynamically adapts based on the logged-in user's role.

### Changed
- Updated the mock user database to include new user roles for testing.
- Secured all relevant application pages and action buttons with the new RBAC system.

## [1.15.0] - 2024-06-16

### Added
- **System-Wide Audit Trail**: Implemented a crucial new module at `/audit-trail` to log all significant user actions, such as creating, updating, or deleting crew, vessels, and other key data.
- **User Action Logging**: All data modification events are now automatically logged with a timestamp and the responsible user's details, providing full traceability.
- **Filterable UI**: The new Audit Trail page includes search and date-range filters to easily inspect system activity.
- **New Icon**: Added a `HistoryIcon.tsx` for the audit trail navigation.

### Changed
- **Architectural Improvement**: Refactored the application's context providers by nesting `DataProvider` within `AuthProvider`. This allows the data layer to be aware of the authenticated user, which is essential for accurate audit logging.

## [1.14.0] - 2024-06-15

### Added
- **Customizable Reports**: Enhanced the Reporting module by allowing users to customize the content of reports before generation.
- **Crew Report Column Selection**: The Crew Roster report now features a column selector, enabling users to choose which data fields (e.g., ID, Rank, Salary, Nationality) to include in the exported PDF.

### Changed
- Updated the `ReportsPage` UI to include controls for report customization.
- Modified the `reportingService` to dynamically generate reports based on user-selected options.

## [1.13.0] - 2024-06-14

### Added
- **Reporting & Analytics Module**: Implemented a new dedicated page at `/reports` for generating professional PDF reports.
- **Report Types**: The new module includes generators for a Crew Roster Report, a Vessel Fleet Report, and a time-based Invoice Summary Report.
- **Interactive UI**: The reports page includes interactive elements, like date-range selectors for financial reports.
- **New Icon**: Added a `FileBarChartIcon.tsx` for the reporting module navigation.
- **New Service**: Created `reportingService.ts` to encapsulate the PDF generation logic using `jspdf`.

## [1.12.0] - 2024-06-13

### Added
- **Surveyor Attachments**: Enhanced the Surveyor Findings module to allow attaching both images and PDF documents to a report.
- **Attachment Previews**: The finding submission form now shows previews for both uploaded images and PDFs.
- **New Icon**: Added a `PdfIcon.tsx` for displaying PDF attachments.

### Changed
- The Surveyor page now displays all attachments (images and PDFs) associated with a finding.
- The underlying data model for `SurveyorFinding` was updated to support different attachment types.

## [1.11.0] - 2024-06-12

### Added
- **Global Search**: Implemented a new global search bar in the main header.
- **Real-time Results**: The search bar provides real-time, categorized results for Crew, Vessels, and Principals as the user types.
- **Quick Navigation**: Search results act as direct links, allowing users to quickly navigate to the relevant list pages.
- **New Component**: Added `GlobalSearchResults.tsx` to handle the display and logic of the search results panel.

### Changed
- **Header Layout**: Updated the main `Header.tsx` to accommodate the new global search bar, creating a more dynamic and functional layout.

## [1.10.0] - 2024-06-11

### Added
- **Login & Authentication Flow**: Implemented a realistic authentication flow with a dedicated `/login` page. The application now has protected routes, requiring users to log in before accessing content.
- **Settings Page**: Created a new `/settings` page, allowing users to configure application preferences.
- **Theme Management**: Users can now choose between Light, Dark, and System theme settings.
- **Notification Preferences**: Users can enable or disable specific categories of notifications (Compliance, Billing, Appraisals).
- **Centralized Settings Context**: Introduced a new `SettingsContext` to manage all user-configurable preferences, which are persisted in `localStorage`.
- **New Components**: Added `LoginPage`, `SettingsPage`, `ProtectedRoute`, `ToggleSwitch`, and `SettingsIcon`.

### Changed
- **Upgraded AuthContext**: The authentication context was overhauled to support username/password login against a mock user database.
- **Dynamic Header**: The main header now displays the name of the currently logged-in user.
- **Smarter Notifications**: `NotificationContext` now respects the user's preferences set on the Settings page.
- **Deprecated ThemeContext**: `ThemeContext` is now deprecated in favor of the new `SettingsContext`.

## [1.9.0] - 2024-06-10

### Added
- **Notifications Center**: Implemented a new global notifications system accessible from the header.
- **Dynamic Alerts**: The system automatically generates notifications for critical events, including documents expiring within 30 days and overdue invoices.
- **Interactive UI**: Added a new `BellIcon` to the header that shows a badge for unread notifications and opens a `NotificationPanel` with a list of all recent alerts.
- **New Context**: Created `NotificationContext` to manage the state and generation of notifications globally.

## [1.8.0] - 2024-06-09

### Added
- **Session Timeout**: Implemented a global session timeout for enhanced security. After 15 minutes of inactivity, a warning modal appears, and if there is no further action, the session is terminated. This applies to both Admin and eCrew portals.
- **QR Code ID Card Generation**: Added the ability to generate a printable ID card for each crew member from the Crew List page. The card includes the crew member's photo, details, and a scannable QR code of their ID.
- **New Components**: Added `SessionTimeoutModal`, `SessionExpiredOverlay`, and `CrewIdCardModal`.
- **New Icon**: Added `IdCardIcon.tsx` for the ID card generation action.
- **New Dependency**: Added `qrcode` library for generating QR codes.

## [1.7.0] - 2024-06-08

### Added
- **AI HR Assistant**: Implemented a new intelligent module at `/hr-assistant` to help with HR-related tasks. The assistant can summarize crew history, or generate letters of recommendation and employment verification.
- **New Icon**: Added `RobotIcon.tsx` for the AI HR Assistant navigation item.

### Changed
- **Invoice PDF Enhancement**: Added a "Thank you" message and an authorized signature line to the generated invoice PDFs for a more professional appearance.

## [1.6.0] - 2024-06-07

### Added
- **AI Crew Planner**: Implemented a major new AI-driven module at `/planner`.
- **Crewing Requirements Form**: Users can now specify the vessel and the exact number of crew needed for each rank.
- **Intelligent Crew Suggestions**: The module uses the Gemini API (`handleCrewPlanning`) with a strict JSON `responseSchema` to analyze available 'standby' crew and propose the best candidates for the job.
- **AI Reasoning**: The UI displays the AI's justification for each suggested crew member, providing transparency into the decision-making process.
- **New Icon**: Added `SparklesIcon.tsx` for the AI Planner navigation item.

## [1.5.0] - 2024-06-06

### Added
- **Dashboard Enhancements**: Overhauled the dashboard to be more dynamic and data-driven.
- **New Dynamic KPI**: Added a new KPI card for "Overdue Invoices", calculated dynamically from invoice data.
- **New Invoicing Chart**: Implemented a new `LineChart` to visualize monthly invoicing trends.
- **Dynamic Recent Alerts**: The "Recent Alerts" section now automatically scans all crew documents and displays the top 4 documents that are expiring soonest, making it fully data-driven.

## [1.4.0] - 2024-06-05

### Added
- **eCrew Portal Enhancements**: Implemented major feature upgrades for the Crew Self-Service Portal.
- **eCrew Document Upload**: Seafarers can now upload their own document details directly from their profile page via a new `DocumentUploadModal`.
- **eCrew Payroll History**: Added a new `/ecrew/payroll` page, allowing crew members to view their complete payroll history.
- **New Data Handlers**: Added `addDocumentForCrew` to `DataContext` to support associating new documents with a crew member.

## [1.3.0] - 2024-06-04

### Added
- **Billing & Invoicing Module**: Implemented the final core module at `/billing` for creating, managing, and tracking invoices.
- **Dynamic Invoice Form**: A new `InvoiceFormModal` allows users to create invoices with dynamic line items, automatic total calculation, and tax handling.
- **PDF Invoice Generation**: Integrated `jspdf` to generate and download professional PDF invoices for clients.
- **Invoice Status Management**: Users can now track invoice statuses ('Draft', 'Sent', 'Paid') and update them directly from the UI.
- **New Data Models**: Added `Invoice`, `InvoiceLineItem`, and `MOCK_INVOICES` data.
- **New Icon**: Added `CreditCardIcon.tsx` for the billing module navigation.

## [1.2.0] - 2024-06-03

### Added
- **Surveyor Finding Submission Module**: Implemented a new module at `/surveyor` for submitting findings from the field.
- **Image Uploads**: The new `SurveyorFormModal` supports multiple image uploads, using the `FileReader` API to generate Base64 previews for storage.
- **AI-Powered Summarization**: Integrated Gemini (`handleSummarizeFinding`) to automatically generate a concise summary of the finding's description upon submission.
- **New Data Models**: Added the `SurveyorFinding` type and `MOCK_SURVEYOR_FINDINGS` data.
- **New Icon**: Added `CameraIcon.tsx` for the surveyor module navigation.
- **Dynamic Surveyor Context**: The `DataContext` now exposes an `addSurveyorFinding` function.

## [1.1.0] - 2024-06-02

### Added
- **Job Assignment Module**: Implemented a new module at `/jobs` for creating, assigning, and tracking operational tasks.
- **Job Creation & Editing**: A new `JobFormModal` allows users to create and edit jobs, with dynamic fields to assign tasks to either a specific crew member or a vessel.
- **Job Tracking UI**: The new `JobAssignmentPage` displays a comprehensive table of all jobs with their status ('Pending', 'In Progress', 'Completed').
- **New Data Models**: Added the `Job` type and `MOCK_JOBS` data to support the new module.
- **New Icon**: Added `FilePlusIcon.tsx` for the jobs module navigation.
- **Dynamic Job Context**: The `DataContext` now exposes `addJob` and `updateJob` functions.

### Fixed
- **Code Structure**: Removed a duplicate `src/layouts/ECrewLayout.tsx` file that was causing potential build issues.

## [1.0.1] - 2024-06-01

### Fixed
- **Critical Rendering Crash**: Fixed a recurring `React error #525` that caused a blank screen on the Vessels page. The issue was caused by an incompatibility between `react-simple-maps`'s `<Annotation>` component and React 19. The `FleetMap` component was re-engineered to use stable, native SVG elements for popups, resolving the crash.
- **Duplicate Component**: Removed an extraneous duplicate file `src/layouts/ECrewLayout.tsx` to prevent bundling conflicts and improve code hygiene.
- **Code Cleanup**: Removed the `useEffect` timer workaround from `VesselListPage.tsx` as it was no longer needed after fixing the root cause of the map crash.

## [1.0.0] - 2024-05-31

### Added
- **Crew Self-Service Portal (eCrew)**: Implemented the foundational features of the eCrew portal, a dedicated interface for seafarers.
- **Simulated Authentication**: Created a new `AuthContext` and `useAuth` hook to manage a simulated user session, persisting the logged-in crew member's ID in `localStorage`.
- **"Login As" Feature**: Added a "Login As" button on the main Crew List page, allowing admins to enter the eCrew portal as a specific user.
- **eCrew Layout**: Added a new `ECrewLayout.tsx` with a simplified header and sidebar for the portal.
- **eCrew Profile Page**: Created `ECrewProfilePage.tsx` where seafarers can view their personal details and document status.
- **New Icon**: Added `UserCheckIcon.tsx` for the "Login As" action.

### Changed
- Updated `App.tsx` with a new `AuthProvider` and a separate route structure for `/ecrew`.

## [0.9.0] - 2024-05-30

### Added
- **Appraisals & Reports Module**: Implemented a new module at `/appraisals` to manage crew performance evaluations.
- **PDF Report Generation**: Integrated `jspdf` and `jspdf-autotable` to generate and download professional, Lloyds-style appraisal reports directly from the browser.
- **Appraisal Form Modal**: Created a new `AppraisalFormModal.tsx` for creating new performance reviews, including scoring and comments.
- **New Data Models**: Added the `Appraisal` type and `MOCK_APPRAISALS` data.
- **New Icon**: Added `ClipboardIcon.tsx` for the appraisals module navigation.

### Changed
- Updated `DataContext` to include state and an `addAppraisal` handler.
- Updated `App.tsx` to include the `/appraisals` route.
- Updated the sidebar to link to the new Appraisals page.
- Updated `index.html` to import the new `jspdf` dependencies.

## [0.8.0] - 2024-05-29

### Added
- **Principal Management Module**: Implemented a new module at `/principals` to manage clients/principals.
- **Principal CRUD Functionality**: The new module supports full Create, Read, Update, and Delete operations for principals.
- **Principal Form Modal**: Created a new `PrincipalFormModal.tsx` for adding and editing principal information.
- **New Data Models**: Added the `Principal` type and `MOCK_PRINCIPALS` data.
- **New Icon**: Added `BriefcaseIcon.tsx` for the principals module navigation.

### Changed
- Updated `DataContext` to include state and handlers for principals.
- Updated `App.tsx` to include the `/principraisals` route.
- Updated the sidebar to link to the new Principals page.

## [0.7.0] - 2024-05-28

### Added
- **AI Compliance Analyzer**: Implemented a new module at `/compliance` that uses Google Gemini to analyze crew and document data for compliance issues.
- **Structured AI Responses**: The new `handleComplianceAnalysis` service uses the Gemini API's `responseSchema` feature to get reliable, structured JSON output for identified issues.
- **Compliance UI**: The new `CompliancePage.tsx` provides a user-friendly interface to run the analysis and view results in a clear, card-based format.
- **New Icon**: Added `ShieldIcon.tsx` for the compliance module navigation.

### Changed
- Updated `App.tsx` to include the `/compliance` route.
- Updated the sidebar navigation to link to the new Compliance page.
- Added `ComplianceIssue` interface to `types.ts`.

## [0.6.0] - 2024-05-27

### Added
- **Vessel Management CRUD**: Implemented full Create, Read, Update, and Delete functionality for vessels on the Fleet Management page.
- **Vessel Form Modal**: Created a new `VesselFormModal.tsx` component to handle adding and editing vessel details, including name, IMO, type, and location.
- **Interactive Vessel List**: The vessel roster page now features fully functional "Add Vessel", "Edit", and "Delete" buttons.

### Changed
- Upgraded `DataContext` to include `addVessel`, `updateVessel`, and `deleteVessel` functions for dynamic state management.
- Refactored `VesselListPage.tsx` to manage the state for the new form modal and handle CRUD operations.
- Added `VesselFormData` type to `types.ts` for form handling.

## [0.5.0] - 2024-05-26

### Added
- **Crew Management CRUD**: Implemented full Create, Read, Update, and Delete functionality for crew members.
- **Crew Form Modal**: Created a new `CrewFormModal.tsx` component to handle adding and editing crew members.
- **Dynamic Data Context**: The `DataContext` now exposes `addCrew`, `updateCrew`, and `deleteCrew` functions to dynamically manipulate the application's state.
- **Interactive Crew List**: The crew list page now features "Add Crew", "Edit", and "Delete" buttons that are fully functional.

### Changed
- Refactored `CrewListPage.tsx` to manage the state for the new form modal and handle CRUD operations.
- Added `CrewFormData` type to `types.ts` for form handling.

## [0.4.1] - 2024-05-25

### Fixed
- **SVG Icon Rendering**: Corrected a critical bug where icons were not rendering gradients correctly. Refactored all SVG icon components to use the `useId` React hook, which generates a unique ID for each icon's gradient definition. This prevents ID collisions and ensures all icons display their intended styles consistently across the application.

## [0.4.0] - 2024-05-24

### Changed
- **UI Icon Refresh**: Updated all application icons to a new, modern style featuring a fluid, vibrant green-to-blue gradient. This enhances visual appeal and provides a more consistent, polished look and feel across the UI.

## [0.3.0] - 2024-05-23

### Added
- **Payroll Management Module**: Created a new page at `/payroll` to manage crew salaries and payroll.
- **Crew Salary Overview**: The page displays a table of all crew members with their monthly base salary.
- **Payroll History Modal**: Implemented a modal that shows a detailed payroll history for each crew member, fetched from mock data.
- **Mock Payslip Generation**: Added a button to simulate generating a payslip for a crew member.
- **New Data Models**: Added `Payroll` type and `salary` to the `CrewMember` type. Populated mock data for salaries and payroll history.
- **New Icons**: Added `EyeIcon` and `FileTextIcon` for UI actions in the payroll module.

### Changed
- Updated `DataContext` to provide payroll data across the application.
- Updated `App.tsx` to add the `/payroll` route.

## [0.2.0] - 2024-05-22

### Added
- **Fleet Management Module**: Introduced a new page at `/vessels` for managing the fleet.
- **Fleet Visualization Map**: Implemented an interactive world map on the Fleet Management page to display real-time (mocked) vessel locations using `react-simple-maps`.
- **Vessel Location Popups**: Added popups on the map to show vessel details and crew onboard when a vessel marker is clicked.
- **Vessel Roster**: Added a table to list all vessels with details like IMO, type, and status.
- **CRUD Placeholders**: Added non-functional "Add", "Edit", and "Delete" buttons for future vessel management functionality.
- **New Icons**: Added `PencilIcon`, `TrashIcon`, and `XIcon` for UI actions.

### Changed
- Updated `App.tsx` to include routing for the new `/vessels` page.
- Updated `index.html` to include the `react-simple-maps` dependency.

## [0.1.0] - 2024-05-21

### Added
- **Initial Project Setup**: Created the base React application with TypeScript, Tailwind CSS, and React Router.
- **Core Layout**: Implemented `MainLayout` with a `Sidebar` and `Header`.
- **Themeing**: Added a dark/light theme toggle with `ThemeContext` and localStorage persistence.
- **Data Layer**: Set up a `DataContext` to provide mock data for the application.
- **Dashboard**: Created the initial `Dashboard` page with KPI cards and a `Recharts` bar chart for crew distribution.
- **Crew List Page**: Implemented the `/crew` page with a searchable list of crew members.
- **AI Smart Search**: Integrated a Gemini-powered smart search feature on the crew page.