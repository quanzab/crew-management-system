import React, { useId } from 'react';
export const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
            </defs>
            <rect width="20" height="16" x="2" y="4" rx="2" stroke={`url(#${gradientId})`}/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke={`url(#${gradientId})`}/>
        </svg>
    );
};