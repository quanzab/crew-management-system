
import React, { useId } from 'react';
export const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
          </defs>
          <rect width="20" height="14" x="2" y="5" rx="2" stroke={`url(#${gradientId})`}/>
          <line x1="2" x2="22" y1="10" y2="10" stroke={`url(#${gradientId})`}/>
        </svg>
    );
}