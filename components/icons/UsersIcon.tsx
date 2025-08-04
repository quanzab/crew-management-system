import React, { useId } from 'react';
export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={`url(#${gradientId})`}/>
            <circle cx="9" cy="7" r="4" stroke={`url(#${gradientId})`}/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke={`url(#${gradientId})`}/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={`url(#${gradientId})`}/>
        </svg>
    );
}