import React from 'react';

// Extend from HTMLDivElement attributes to allow passing any standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...rest }) => {
  return (
    // Combine component's base classes with any className passed as a prop.
    <div className={`bg-white dark:bg-card rounded-xl shadow-md p-6 ${className || ''}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;
