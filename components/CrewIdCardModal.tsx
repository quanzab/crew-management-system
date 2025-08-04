import React, { useState, useEffect } from 'react';
import { toDataURL } from 'qrcode';
import { CrewMember } from '../types';
import { XIcon } from './icons/XIcon';
import Card from './Card';

interface CrewIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  crewMember: CrewMember;
}

const CrewIdCardModal: React.FC<CrewIdCardModalProps> = ({ isOpen, onClose, crewMember }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (crewMember) {
      toDataURL(crewMember.id, {
        errorCorrectionLevel: 'H',
        width: 128,
        margin: 1,
        color: {
          dark: '#0f172a', // slate-900
          light: '#0000', // transparent
        }
      })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code', err);
      });
    }
  }, [crewMember]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #id-card-print-area, #id-card-print-area * {
            visibility: visible;
          }
          #id-card-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            display: flex;
            justify-content: center;
            align-items: center;
          }
           .no-print {
             display: none;
           }
        }
      `}</style>
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
        <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4 no-print">
            <h2 className="text-xl font-bold text-card-foreground">Crew ID Card</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-muted">
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <div id="id-card-print-area">
            <div className="bg-white dark:bg-slate-200 rounded-xl p-6 text-center text-slate-900 font-sans w-[320px] shadow-lg">
                <div className="mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary-700">CMS Pro, Inc.</h3>
                    <p className="text-xs text-slate-500">Official Crew Identification</p>
                </div>
              <img
                src={crewMember.avatarUrl}
                alt={crewMember.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary-600 object-cover"
              />
              <h2 className="text-2xl font-bold text-slate-800">{crewMember.name}</h2>
              <p className="text-md font-semibold text-primary-800">{crewMember.rank}</p>
              <p className="text-sm text-slate-500 mt-1">ID: {crewMember.id}</p>

              <div className="mt-6 flex justify-center">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                ) : (
                  <div className="w-32 h-32 bg-slate-300 animate-pulse rounded-md"></div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Print Card
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CrewIdCardModal;
