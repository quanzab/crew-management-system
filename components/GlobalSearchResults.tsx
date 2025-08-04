
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import Card from './Card';
import { UsersIcon } from './icons/UsersIcon';
import { ShipIcon } from './icons/ShipIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface GlobalSearchResultsProps {
  searchTerm: string;
  onClose: () => void;
}

const ResultItem: React.FC<{ to: string; icon: React.ReactNode; primary: string; secondary: string; onClick: () => void; }> = ({ to, icon, primary, secondary, onClick }) => (
    <li className="list-none">
        <Link to={to} onClick={onClick} className="flex items-center gap-3 p-3 -m-3 rounded-lg hover:bg-muted transition-colors" aria-label={`Search result for ${primary}`}>
            <span className="flex-shrink-0 text-primary-500">{icon}</span>
            <div className="flex-grow">
                <p className="text-sm font-semibold text-card-foreground">{primary}</p>
                <p className="text-xs text-muted-foreground">{secondary}</p>
            </div>
        </Link>
    </li>
);

const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = ({ searchTerm, onClose }) => {
    const { crew, vessels, principals } = useData();

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredCrew = useMemo(() =>
        crew.filter(c =>
            c.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            c.rank.toLowerCase().includes(lowerCaseSearchTerm)
        ).slice(0, 5), // Limit results to prevent huge lists
        [crew, lowerCaseSearchTerm]
    );

    const filteredVessels = useMemo(() =>
        vessels.filter(v =>
            v.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            String(v.imo).includes(lowerCaseSearchTerm)
        ).slice(0, 5),
        [vessels, lowerCaseSearchTerm]
    );

    const filteredPrincipals = useMemo(() =>
        principals.filter(p =>
            p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            p.contactPerson.toLowerCase().includes(lowerCaseSearchTerm)
        ).slice(0, 5),
        [principals, lowerCaseSearchTerm]
    );

    const totalResults = filteredCrew.length + filteredVessels.length + filteredPrincipals.length;

    return (
        <Card className="absolute top-full mt-2 w-full min-w-[300px] sm:w-auto sm:min-w-[400px] md:w-full md:max-w-lg shadow-2xl z-50 p-3 max-h-[70vh] overflow-y-auto">
            {totalResults > 0 ? (
                <div className="space-y-4">
                    {filteredCrew.length > 0 && (
                        <section>
                            <h3 className="px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Crew</h3>
                            <ul className="mt-1 space-y-1">{filteredCrew.map(c => <ResultItem key={c.id} to="/crew" icon={<UsersIcon className="w-5 h-5"/>} primary={c.name} secondary={c.rank} onClick={onClose} />)}</ul>
                        </section>
                    )}
                    {filteredVessels.length > 0 && (
                        <section>
                            <h3 className="px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Vessels</h3>
                            <ul className="mt-1 space-y-1">{filteredVessels.map(v => <ResultItem key={v.id} to="/vessels" icon={<ShipIcon className="w-5 h-5"/>} primary={v.name} secondary={`IMO: ${v.imo}`} onClick={onClose} />)}</ul>
                        </section>
                    )}
                    {filteredPrincipals.length > 0 && (
                        <section>
                            <h3 className="px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Principals</h3>
                            <ul className="mt-1 space-y-1">{filteredPrincipals.map(p => <ResultItem key={p.id} to="/principals" icon={<BriefcaseIcon className="w-5 h-5"/>} primary={p.name} secondary={p.contactPerson} onClick={onClose} />)}</ul>
                        </section>
                    )}
                </div>
            ) : (
                <div className="text-center p-6">
                    <p className="text-sm font-semibold text-card-foreground">No results found for "{searchTerm}"</p>
                    <p className="text-xs text-muted-foreground mt-1">Try a different search term.</p>
                </div>
            )}
        </Card>
    );
};

export default GlobalSearchResults;
