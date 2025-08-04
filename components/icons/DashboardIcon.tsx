import React, { useId } from 'react';
export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <rect width="7" height="9" x="3" y="3" rx="1" stroke={`url(#${gradientId})`}/>
            <rect width="7" height="5" x="14" y="3" rx="1" stroke={`url(#${gradientId})`}/>
            <rect width="7" height="9" x="14" y="12" rx="1" stroke={`url(#${gradientId})`}/>
            <rect width="7" height="5" x="3" y="16" rx="1" stroke={`url(#${gradientId})`}/>
        </svg>
    );
}