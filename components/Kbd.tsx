import React from 'react';

const Kbd: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-muted dark:text-gray-100 dark:border-gray-500">
      {children}
    </kbd>
  );
};

export default Kbd;
