import React, { useId } from 'react';
export const LogOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={`url(#${gradientId})`}/>
            <polyline points="16 17 21 12 16 7" stroke={`url(#${gradientId})`}/>
            <line x1="21" x2="9" y1="12" y2="12" stroke={`url(#${gradientId})`}/>
        </svg>
    );
}