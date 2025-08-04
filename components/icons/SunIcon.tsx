import React, { useId } from 'react';
export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="4" fill={`url(#${gradientId})`}/>
            <path d="M12 2v2" stroke={`url(#${gradientId})`} strokeWidth="2.5"/>
            <path d="M12 20v2" stroke={`url(#${gradientId})`} strokeWidth="2.5"/>
            <path d="m4.93 4.93 1.41 1.41" stroke={`url(#${gradientId})`} strokeWidth="2.5"/>
            <path d="m17.66 17.66 1.41 1.41" stroke={`url(#${gradientId})`} strokeWidth="2.5"/>
            <path d="M2 12h2" stroke={`url(#${gradientId})`} strokeWidth="2.5"/>
            <path d="M20 12h2" stroke={`url(#${gradientId})`} strokeWidth="2.5"/>
            <path d="m6.34 17.66-1.41 1.41" stroke={`url(#${gradientId})`} strokeWidth="2.5"/>
            <path d="m19.07 4.93-1.41 1.41" stroke={`url(#${gradientId})`} strokeWidth="2.5"/>
        </svg>
    );
}