
import React, { useId } from 'react';
export const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" stroke={`url(#${gradientId})`}/>
            <line x1="12" y1="8" x2="12" y2="16" stroke={`url(#${gradientId})`}/>
            <line x1="8" y1="12" x2="16" y2="12" stroke={`url(#${gradientId})`}/>
        </svg>
    );
}
