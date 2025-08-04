import React, { useId } from 'react';
export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <path d="M3 6h18" stroke={`url(#${gradientId})`}/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={`url(#${gradientId})`}/>
            <line x1="10" y1="11" x2="10" y2="17" stroke={`url(#${gradientId})`}/>
            <line x1="14" y1="11" x2="14" y2="17" stroke={`url(#${gradientId})`}/>
        </svg>
    );
}