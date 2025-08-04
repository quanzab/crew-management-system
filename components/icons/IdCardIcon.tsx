
import React, { useId } from 'react';
export const IdCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <rect width="18" height="18" x="3" y="3" rx="2" stroke={`url(#${gradientId})`}/>
            <path d="M7 7h.01" stroke={`url(#${gradientId})`}/>
            <path d="M17 17h-5" stroke={`url(#${gradientId})`}/>
            <path d="M17 13H7" stroke={`url(#${gradientId})`}/>
            <path d="M7 13v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" stroke={`url(#${gradientId})`}/>
        </svg>
    );
};
