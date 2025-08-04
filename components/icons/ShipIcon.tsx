import React, { useId } from 'react';
export const ShipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9-.5 2.5-1" stroke={`url(#${gradientId})`}/>
            <path d="M19.38 20A11.6 11.6 0 0 0 22 12V9l-8-4-8 4v3a11.6 11.6 0 0 0 2.62 8" stroke={`url(#${gradientId})`}/>
            <path d="M12 12v8" stroke={`url(#${gradientId})`}/>
            <path d="M12 3v4" stroke={`url(#${gradientId})`}/>
        </svg>
    );
}