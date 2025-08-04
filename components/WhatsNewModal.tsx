import React from 'react';
import Card from './Card';
import { ChangelogEntry } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { XIcon } from './icons/XIcon';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ChangelogEntry | null;
}

const tagColors: { [key: string]: string } = {
  Added: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Changed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Fixed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Removed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[95] flex justify-center items-center p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <SparklesIcon className="w-10 h-10 text-primary-500" />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">What's New in v{content.version}</h2>
                    <p className="text-sm text-muted-foreground">Here are the latest updates to the platform. Released on {new Date(content.date).toLocaleDateString()}.</p>
                </div>
            </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-4 my-4">
            {content.changes.map((change, index) => (
                <div key={index}>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${tagColors[change.type] || 'bg-gray-200 text-gray-800'}`}>
                        {change.type}
                    </span>
                    <ul className="mt-2 ml-2 list-disc list-inside space-y-1">
                        {change.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-card-foreground">
                                <span dangerouslySetInnerHTML={{ __html: item.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs text-accent">$&</code>') }} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-muted">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Got it!
          </button>
        </div>
      </Card>
    </div>
  );
};

export default WhatsNewModal;
