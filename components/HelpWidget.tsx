import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';
import { useToast } from '../hooks/useToast';
import { HelpCircleIcon } from './icons/HelpCircleIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { MailIcon } from './icons/MailIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { XIcon } from './icons/XIcon';

const HelpWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToast();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleFeedback = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast('Thank you for your feedback!', 'success');
    setIsOpen(false);
  }

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="absolute bottom-full right-0 mb-3 w-72 shadow-2xl">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Help & Support</h3>
            <ul className="space-y-2">
                <li>
                    <a href="#" className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-muted transition-colors text-card-foreground">
                        <BookOpenIcon className="w-5 h-5 text-primary-500" />
                        <span>Documentation</span>
                    </a>
                </li>
                 <li>
                    <a href="#" className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-muted transition-colors text-card-foreground">
                        <HistoryIcon className="w-5 h-5 text-primary-500" />
                        <span>View Changelog</span>
                    </a>
                </li>
                <li>
                    <a href="mailto:support@cmspro.com" className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-muted transition-colors text-card-foreground">
                        <MailIcon className="w-5 h-5 text-primary-500" />
                        <span>Contact Support</span>
                    </a>
                </li>
                <li>
                    <a href="#" onClick={handleFeedback} className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-muted transition-colors text-card-foreground">
                        <MessageSquareIcon className="w-5 h-5 text-primary-500" />
                        <span>Submit Feedback</span>
                    </a>
                </li>
            </ul>
        </Card>
      )}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50"
        aria-label={isOpen ? "Close help widget" : "Open help widget"}
      >
        {isOpen ? <XIcon className="w-7 h-7" /> : <HelpCircleIcon className="w-7 h-7" />}
      </button>
    </div>
  );
};

export default HelpWidget;
