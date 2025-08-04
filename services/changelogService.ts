import { ChangelogEntry, ChangelogChange } from '../types';

// In a real application, you would fetch this file.
// For this environment, we are hardcoding the content.
const changelogContent = `
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
- **Global Command Palette**: Implemented a new command palette, accessible via \`Ctrl+P\` (or \`⌘+P\`), for quick navigation and actions.
- **Quick Actions**: The palette allows users to instantly navigate to any page, initiate actions like adding crew or creating invoices, toggle the theme, and log out.
- **Context-Aware Commands**: The available commands are dynamically filtered based on the user's role and permissions.
- **New Icons**: Added \`CommandIcon\` and \`PlusCircleIcon\` to support the new UI.

## [1.23.0] - 2024-06-24

### Added
- **Help & Support Widget**: Implemented a new floating widget on all main pages to provide users with quick access to help resources.
- **Quick Links**: The new widget includes links for documentation, changelog, contacting support, and submitting feedback.

## [1.22.0] - 2024-06-23

### Added
- **What's New Modal**: Implemented a new "What's New" modal that appears after login to inform users about the latest features and updates from the changelog.
- **Last Seen Version Tracking**: The system now tracks the last changelog version viewed by the user in \`localStorage\` to ensure the modal only appears when there are new updates.

### Changed
- The \`AuthContext\` now orchestrates showing the "What's New" modal post-login.

## [1.21.0] - 2024-06-22

### Added
- **Global Toast Notifications**: Implemented a global toast notification system to provide immediate, non-intrusive feedback for user actions.
- **Action Confirmation**: When users create, update, or delete data (e.g., adding a crew member, updating a vessel), a confirmation toast now appears.
- **New Context & Hook**: Added \`ToastContext.tsx\` and a \`useToast\` hook to manage toast state globally.
- **New Components**: Created \`ToastContainer.tsx\` and \`Toast.tsx\` to render notifications, with support for different styles (success, error) and icons.
`;

export const parseChangelog = (): ChangelogEntry[] => {
    const entries: ChangelogEntry[] = [];
    const lines = changelogContent.trim().split('\n');
    let currentEntry: ChangelogEntry | null = null;
    let currentChangeType: ChangelogChange | null = null;

    for (const line of lines) {
        const versionMatch = line.match(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})/);
        if (versionMatch) {
            if (currentEntry) {
                entries.push(currentEntry);
            }
            currentEntry = {
                version: versionMatch[1],
                date: versionMatch[2],
                changes: [],
            };
            currentChangeType = null;
            continue;
        }

        const changeTypeMatch = line.match(/^### (Added|Changed|Fixed|Removed)/);
        if (changeTypeMatch && currentEntry) {
            currentChangeType = {
                type: changeTypeMatch[1],
                items: [],
            };
            currentEntry.changes.push(currentChangeType);
            continue;
        }

        const itemMatch = line.match(/^- (.*)/);
        if (itemMatch && currentChangeType) {
            currentChangeType.items.push(itemMatch[1].trim());
        }
    }

    if (currentEntry) {
        entries.push(currentEntry);
    }

    return entries;
};