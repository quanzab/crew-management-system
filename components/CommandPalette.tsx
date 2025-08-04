
import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from '../types';
import { usePermissions } from '../hooks/usePermissions';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../hooks/useAuth';
import { CommandIcon } from './icons/CommandIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { RobotIcon } from './icons/RobotIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ShipIcon } from './icons/ShipIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { FilePlusIcon } from './icons/FilePlusIcon';
import { CameraIcon } from './icons/CameraIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { FileBarChartIcon } from './icons/FileBarChartIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { LogOutIcon } from './icons/LogOutIcon';
import { ClockIcon } from './icons/ClockIcon';
import Kbd from './Kbd';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_COMMANDS_KEY = 'cms-pro-recent-commands';
const RECENT_COMMANDS_LIMIT = 5;

// --- Helper Functions & Components ---

/**
 * A simple fuzzy search algorithm that scores matches.
 * Higher score is better. Returns null if no match.
 */
const fuzzySearch = (term: string, text: string): { score: number; matches: number[] } | null => {
    const searchTerm = term.toLowerCase();
    const targetText = text.toLowerCase();
    if (!searchTerm) return null;

    const matches: number[] = [];
    let searchPosition = 0;
    let score = 0;
    let lastMatchIndex = -1;

    for (let i = 0; i < targetText.length && searchPosition < searchTerm.length; i++) {
        if (targetText[i] === searchTerm[searchPosition]) {
            matches.push(i);
            
            let currentScore = 100; // Base score for a match
            if (lastMatchIndex !== -1) {
                const gap = i - lastMatchIndex - 1;
                if (gap === 0) currentScore += 75; // Bonus for consecutive
                else currentScore -= gap * 10; // Penalty for gaps
            } else {
                 currentScore -= i * 5; // Penalty for starting late
            }
            if (i === 0 || targetText[i-1] === ' ') currentScore += 50; // Bonus for word starts

            score += currentScore;
            lastMatchIndex = i;
            searchPosition++;
        }
    }
    return searchPosition === searchTerm.length ? { score, matches } : null;
};

/**
 * A component to render text with highlighted characters.
 */
const HighlightedText: React.FC<{ text: string; indices: number[] | undefined }> = ({ text, indices }) => {
    if (!indices || indices.length === 0) return <>{text}</>;
    return (
        <>
            {text.split('').map((char, index) => 
                indices.includes(index)
                    ? <strong key={index} className="text-accent">{char}</strong>
                    : <span key={index}>{char}</span>
            )}
        </>
    );
};

// --- Main Component ---

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const permissions = usePermissions();
    const { settings, setTheme } = useSettings();
    const { logout } = useAuth();
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [recentCommandIds, setRecentCommandIds] = useState<string[]>([]);
    
    // Load recent commands from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(RECENT_COMMANDS_KEY);
            if (stored) setRecentCommandIds(JSON.parse(stored));
        } catch (e) {
            console.error("Failed to parse recent commands from localStorage", e);
        }
    }, []);

    const addCommandToRecent = (commandId: string) => {
        const updatedIds = [commandId, ...recentCommandIds.filter(id => id !== commandId)].slice(0, RECENT_COMMANDS_LIMIT);
        setRecentCommandIds(updatedIds);
        localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(updatedIds));
    };

    const allCommands = useMemo<Command[]>(() => {
        const createNavCommand = (path: string, title: string, icon: React.ReactNode, permission: boolean, subtitle?: string): Command[] => 
            permission ? [{ id: `nav-${path}`, title, subtitle, category: 'Navigation', icon, action: () => navigate(path) }] : [];

        const createActionCommand = (id: string, title: string, path: string, icon: React.ReactNode, permission: boolean): Command[] =>
            permission ? [{ id: `action-${id}`, title, subtitle: `Navigate to ${id} and open form`, category: 'Actions', icon, action: () => navigate(`${path}?action=add`) }] : [];

        return [
            ...createNavCommand('/dashboard', 'Go to Dashboard', <DashboardIcon className="w-5 h-5" />, true),
            ...createNavCommand('/planner', 'Go to AI Planner', <SparklesIcon className="w-5 h-5" />, permissions.canAccessAIPlanner),
            ...createNavCommand('/hr-assistant', 'Go to AI HR Assistant', <RobotIcon className="w-5 h-5" />, permissions.canAccessAIHRAssistant),
            ...createNavCommand('/crew', 'Go to Crew', <UsersIcon className="w-5 h-5" />, permissions.canAccessCrew),
            ...createNavCommand('/vessels', 'Go to Vessels', <ShipIcon className="w-5 h-5" />, permissions.canAccessVessels),
            ...createNavCommand('/payroll', 'Go to Payroll', <DollarSignIcon className="w-5 h-5" />, permissions.canAccessPayroll),
            ...createNavCommand('/compliance', 'Go to Compliance', <ShieldIcon className="w-5 h-5" />, permissions.canAccessCompliance),
            ...createNavCommand('/principals', 'Go to Principals', <BriefcaseIcon className="w-5 h-5" />, permissions.canAccessPrincipals),
            ...createNavCommand('/appraisals', 'Go to Appraisals', <ClipboardIcon className="w-5 h-5" />, permissions.canAccessAppraisals),
            ...createNavCommand('/jobs', 'Go to Jobs', <FilePlusIcon className="w-5 h-5" />, permissions.canAccessJobs),
            ...createNavCommand('/surveyor', 'Go to Surveyor', <CameraIcon className="w-5 h-5" />, permissions.canAccessSurveyor),
            ...createNavCommand('/billing', 'Go to Billing', <CreditCardIcon className="w-5 h-5" />, permissions.canAccessBilling),
            ...createNavCommand('/reports', 'Go to Reporting', <FileBarChartIcon className="w-5 h-5" />, permissions.canAccessReports),
            ...createNavCommand('/audit-trail', 'Go to Audit Trail', <HistoryIcon className="w-5 h-5" />, permissions.canAccessAuditTrail),
            ...createNavCommand('/settings', 'Go to Settings', <SettingsIcon className="w-5 h-5" />, permissions.canAccessSettings),
            ...createActionCommand('Crew', 'Add New Crew', '/crew', <PlusCircleIcon className="w-5 h-5" />, permissions.canAddCrew),
            ...createActionCommand('Vessel', 'Add New Vessel', '/vessels', <PlusCircleIcon className="w-5 h-5" />, permissions.canAddVessel),
            ...createActionCommand('Principal', 'Add New Principal', '/principals', <PlusCircleIcon className="w-5 h-5" />, permissions.canAddPrincipal),
            ...createActionCommand('Job', 'Add New Job', '/jobs', <PlusCircleIcon className="w-5 h-5" />, permissions.canAddJob),
            ...createActionCommand('Appraisal', 'Add New Appraisal', '/appraisals', <PlusCircleIcon className="w-5 h-5" />, permissions.canAddAppraisal),
            ...createActionCommand('Invoice', 'Create New Invoice', '/billing', <PlusCircleIcon className="w-5 h-5" />, permissions.canCreateInvoice),
            ...createActionCommand('Finding', 'Submit Surveyor Finding', '/surveyor', <PlusCircleIcon className="w-5 h-5" />, permissions.canSubmitSurveyorFinding),
            {
                id: 'action-toggle-theme', title: 'Toggle Theme', subtitle: `Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode`,
                category: 'Actions', icon: settings.theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />,
                action: () => setTheme(settings.theme === 'dark' ? 'light' : 'dark')
            },
            { id: 'action-logout', title: 'Logout', category: 'Actions', icon: <LogOutIcon className="w-5 h-5" />, action: logout },
        ].flat();
    }, [permissions, settings.theme, navigate, setTheme, logout]);

    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        return allCommands.map(command => {
                const titleResult = fuzzySearch(searchTerm, command.title);
                const subtitleResult = command.subtitle ? fuzzySearch(searchTerm, command.subtitle) : null;
                
                if (!titleResult && !subtitleResult) return null;

                const result = (subtitleResult && (!titleResult || subtitleResult.score > titleResult.score)) ? subtitleResult : titleResult;
                const matchSource = (subtitleResult && (!titleResult || subtitleResult.score > titleResult.score)) ? 'subtitle' : 'title';

                return { command, score: result!.score, matches: result!.matches, matchSource };
            })
            .filter(Boolean)
            .sort((a, b) => b!.score - a!.score) as { command: Command, matches: number[], matchSource: 'title' | 'subtitle' }[];
    }, [searchTerm, allCommands]);
    
    const recentCommands = useMemo(() => {
        if (searchTerm) return []; // Don't show recents when searching
        return recentCommandIds
            .map(id => allCommands.find(cmd => cmd.id === id))
            .filter(Boolean) as Command[];
    }, [recentCommandIds, allCommands, searchTerm]);

    const groupedCommands = useMemo(() => {
        const commandsToGroup = searchTerm ? searchResults : allCommands.map(c => ({ command: c, matches: [], matchSource: 'title' as 'title' | 'subtitle' }));
        
        const groups = commandsToGroup.reduce((acc, item) => {
            const category = item.command.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {} as Record<string, typeof searchResults>);

        if (!searchTerm && recentCommands.length > 0) {
            return {
                'Recently Used': recentCommands.map(c => ({ command: c, matches: [], matchSource: 'title' as 'title' | 'subtitle'})),
                ...groups
            };
        }
        return groups;

    }, [searchTerm, searchResults, allCommands, recentCommands]);

    const flatCommandList = useMemo(() => Object.values(groupedCommands).flat(), [groupedCommands]);

    const executeCommand = (cmd: Command) => {
        addCommandToRecent(cmd.id);
        cmd.action();
        onClose();
    };

    useEffect(() => {
        if (!isOpen) return;
        setSearchTerm('');
        inputRef.current?.focus();
    }, [isOpen]);
    
    useEffect(() => {
        setActiveIndex(0);
    }, [searchTerm]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(i => (i + 1) % flatCommandList.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(i => (i - 1 + flatCommandList.length) % flatCommandList.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (flatCommandList[activeIndex]) {
                    executeCommand(flatCommandList[activeIndex].command);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeIndex, flatCommandList, onClose]);
    
    useEffect(() => {
        listRef.current?.querySelector(`[data-command-id="${flatCommandList[activeIndex]?.command.id}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex, flatCommandList]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 flex justify-center items-start pt-20" onClick={onClose}>
            <div className="w-full max-w-2xl bg-card rounded-xl shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 p-4 border-b border-muted">
                    <CommandIcon className="w-6 h-6 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or search..."
                        className="w-full bg-transparent text-card-foreground text-lg focus:outline-none placeholder:text-muted-foreground"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <ul ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
                    {flatCommandList.length > 0 ? Object.entries(groupedCommands).map(([category, commands]) => (
                        <Fragment key={category}>
                            <li className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                                {category === 'Recently Used' && <ClockIcon className="w-4 h-4" />}
                                {category}
                            </li>
                            {commands.map((item) => {
                                const isSelected = flatCommandList[activeIndex]?.command.id === item.command.id;
                                return (
                                <li
                                    key={item.command.id}
                                    data-command-id={item.command.id}
                                    onClick={() => executeCommand(item.command)}
                                    className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer ${isSelected ? 'bg-primary-600 text-white' : 'text-card-foreground hover:bg-muted'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={isSelected ? 'text-white' : 'text-muted-foreground'}>{item.command.icon}</span>
                                        <div>
                                            <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-card-foreground'}`}>
                                                <HighlightedText text={item.command.title} indices={item.matchSource === 'title' ? item.matches : undefined} />
                                            </p>
                                            {item.command.subtitle && (
                                                <p className={`text-xs ${isSelected ? 'text-primary-200' : 'text-muted-foreground'}`}>
                                                    <HighlightedText text={item.command.subtitle} indices={item.matchSource === 'subtitle' ? item.matches : undefined} />
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {isSelected && <Kbd>Enter</Kbd>}
                                </li>
                                )
                            })}
                        </Fragment>
                    )) : (
                        <li className="text-center p-8 text-muted-foreground">No commands found for "{searchTerm}".</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CommandPalette;