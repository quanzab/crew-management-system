
import React, { useId } from 'react';
export const FileBarChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const gradientId = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
          </defs>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" stroke={`url(#${gradientId})`}/>
          <path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={`url(#${gradientId})`}/>
          <path d="M8 18v-2" stroke={`url(#${gradientId})`}/>
          <path d="M12 18v-4" stroke={`url(#${gradientId})`}/>
          <path d="M16 18v-6" stroke={`url(#${gradientId})`}/>
        </svg>
    );
};