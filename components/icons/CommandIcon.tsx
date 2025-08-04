
import React, { useId } from 'react';
export const CommandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <path d="M18 9.5-6-2.5" stroke={`url(#${gradientId})`}/>
            <path d="M18 14.5-6 26.5" stroke={`url(#${gradientId})`}/>
            <path d="m6 9.5 12 5" stroke={`url(#${gradientId})`}/>
            <path d="m6 14.5 12-5" stroke={`url(#${gradientId})`}/>
        </svg>
    );
}
