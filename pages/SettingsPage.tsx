

import React from 'react';
import Card from '../components/Card';
import { useSettings } from '../hooks/useSettings';
import ToggleSwitch from '../components/ToggleSwitch';
import { MoonIcon } from '../components/icons/MoonIcon';
import { SunIcon } from '../components/icons/SunIcon';

const SettingsPage: React.FC = () => {
    const { settings, setTheme, setNotificationSetting } = useSettings();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Settings</h1>

            <Card>
                <h2 className="text-xl font-semibold text-card-foreground border-b border-muted pb-4 mb-4">Appearance</h2>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Choose how the application looks. Select 'System' to match your OS preference.</p>
                    <div className="flex items-center space-x-4">
                        {(['light', 'dark', 'system'] as const).map(themeOption => (
                            <button
                                key={themeOption}
                                onClick={() => setTheme(themeOption)}
                                className={`px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors
                                    ${settings.theme === themeOption 
                                        ? 'bg-primary-600 text-white' 
                                        : 'bg-muted text-card-foreground hover:bg-muted/70'
                                    }`}
                            >
                                {themeOption === 'light' && <SunIcon className="w-5 h-5" />}
                                {themeOption === 'dark' && <MoonIcon className="w-5 h-5" />}
                                <span className="capitalize">{themeOption}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold text-card-foreground border-b border-muted pb-4 mb-4">Notifications</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-card-foreground">Compliance Alerts</p>
                            <p className="text-sm text-muted-foreground">Receive notifications for expiring documents.</p>
                        </div>
                        <ToggleSwitch
                            id="compliance-notifications"
                            checked={settings.notifications.compliance}
                            onChange={(e) => setNotificationSetting('compliance', e.target.checked)}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-card-foreground">Billing Alerts</p>
                            <p className="text-sm text-muted-foreground">Receive notifications for overdue invoices.</p>
                        </div>
                        <ToggleSwitch
                            id="billing-notifications"
                            checked={settings.notifications.billing}
                            onChange={(e) => setNotificationSetting('billing', e.target.checked)}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-card-foreground">Appraisal Alerts</p>
                            <p className="text-sm text-muted-foreground">Receive notifications for new crew appraisals.</p>
                        </div>
                        <ToggleSwitch
                            id="appraisal-notifications"
                            checked={settings.notifications.appraisals}
                            onChange={(e) => setNotificationSetting('appraisals', e.target.checked)}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-card-foreground">HR Alerts</p>
                            <p className="text-sm text-muted-foreground">Receive notifications for crew status changes (e.g., now on standby).</p>
                        </div>
                        <ToggleSwitch
                            id="hr-notifications"
                            checked={settings.notifications.hr}
                            onChange={(e) => setNotificationSetting('hr', e.target.checked)}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;