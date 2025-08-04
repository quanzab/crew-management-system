
import React, { useId } from 'react';
export const RobotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
          </defs>
          <path d="M12 8V4H8" stroke={`url(#${gradientId})`} />
          <rect width="16" height="12" x="4" y="8" rx="2" stroke={`url(#${gradientId})`} />
          <path d="M2 14h2" stroke={`url(#${gradientId})`} />
          <path d="M20 14h2" stroke={`url(#${gradientId})`} />
          <path d="M15 13v2" stroke={`url(#${gradientId})`} />
          <path d="M9 13v2" stroke={`url(#${gradientId})`} />
        </svg>
    );
};
