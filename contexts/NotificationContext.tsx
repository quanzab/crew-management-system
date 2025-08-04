


import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useData } from '../hooks/useData';
import { useSettings } from '../hooks/useSettings';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { crew, invoices, principals, appraisals, auditLogs } = useData();
  const { settings } = useSettings();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const generatedNotifications: Notification[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // 1. Check for expiring documents if compliance notifications are enabled
    if (settings.notifications.compliance) {
      crew.forEach(member => {
        member.documents.forEach(doc => {
          const expiryDate = new Date(doc.expiryDate);
          if (expiryDate >= today && expiryDate <= thirtyDaysFromNow) {
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            generatedNotifications.push({
              id: `doc-${doc.id}`,
              type: 'compliance',
              message: `${doc.type} for ${member.name} expires in ${daysUntilExpiry} days.`,
              timestamp: new Date().toISOString(),
              isRead: false,
              relatedId: member.id,
            });
          }
        });
      });
    }

    // 2. Check for overdue invoices if billing notifications are enabled
    if (settings.notifications.billing) {
      invoices.forEach(invoice => {
        const dueDate = new Date(invoice.dueDate);
        if (dueDate < today && invoice.status !== 'Paid') {
          const principalName = principals.find(p => p.id === invoice.principalId)?.name || 'a principal';
          generatedNotifications.push({
            id: `inv-${invoice.id}`,
            type: 'billing',
            message: `Invoice ${invoice.invoiceNumber} for ${principalName} is overdue.`,
            timestamp: new Date().toISOString(),
            isRead: false,
            relatedId: invoice.id,
          });
        }
      });
    }
    
    // 3. Check for new appraisals if appraisal notifications are enabled
    if (settings.notifications.appraisals) {
        const latestAppraisal = appraisals.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        if (latestAppraisal) {
            const crewMember = crew.find(c => c.id === latestAppraisal.crewMemberId);
            generatedNotifications.push({
                id: `app-${latestAppraisal.id}`,
                type: 'appraisal',
                message: `A new appraisal was submitted for ${crewMember?.name || 'a crew member'}.`,
                timestamp: new Date(latestAppraisal.date).toISOString(),
                isRead: false,
                relatedId: latestAppraisal.id,
            });
        }
    }
    
    // 4. Check for newly standby crew if HR notifications are enabled
    if (settings.notifications.hr) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const standbyLogs = auditLogs.filter(log => 
            log.action === 'UPDATE_CREW_STATUS' &&
            log.details.toLowerCase().endsWith('to standby') &&
            new Date(log.timestamp) > sevenDaysAgo
        );

        standbyLogs.forEach(log => {
            const crewMember = crew.find(c => c.id === log.targetId);
            if (crewMember) {
                // Avoid duplicate notifications for the same event
                if (!generatedNotifications.some(n => n.id === `hr-${log.id}`)) {
                    generatedNotifications.push({
                        id: `hr-${log.id}`,
                        type: 'hr',
                        message: `${crewMember.name} is now on standby and available for assignment.`,
                        timestamp: log.timestamp,
                        isRead: false,
                        relatedId: crewMember.id,
                    });
                }
            }
        });
    }


    // Sort notifications by timestamp descending
    generatedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Here we'd typically compare with previous notifications to avoid re-adding old ones
    // but for this stateless example, we'll just set them. A real app might handle persistence.
    setNotifications(generatedNotifications);
  }, [crew, invoices, principals, appraisals, auditLogs, settings.notifications]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }), [notifications, unreadCount, markAsRead, markAllAsRead]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};