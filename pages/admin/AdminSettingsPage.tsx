
import React, { useState } from 'react';
import Button from '../../components/Button';
import { CogIcon, ServerIcon, ShieldCheckIcon, BellIcon } from '@heroicons/react/24/outline';

interface SettingsData {
  platformName: string;
  defaultCurrency: string;
  adminEmail: string;
  maintenanceMode: boolean;
  enableEmailNotifications: boolean;
}

const initialSettings: SettingsData = {
  platformName: 'MegaInvest Platform',
  defaultCurrency: 'USD',
  adminEmail: 'admin@megainvest.com',
  maintenanceMode: false,
  enableEmailNotifications: true,
};

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveStatus(null);
    // Simulate API call to save settings
    console.log("Saving settings:", settings);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    setIsLoading(false);
    // Mock success/error
    if (settings.platformName) { // Basic validation
        setSaveStatus('success');
    } else {
        setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus(null), 3000); // Clear status message
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white text-secondary-700 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm placeholder-secondary-400";
  const labelClass = "block text-sm font-medium text-secondary-700";
  const sectionClass = "bg-white p-6 shadow-lg rounded-xl";

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <CogIcon className="h-8 w-8 text-primary-600"/>
        <h1 className="text-3xl font-bold text-secondary-800">Platform Settings</h1>
      </div>

      {saveStatus === 'success' && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Success!</p>
          <p>Settings saved successfully.</p>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error!</p>
          <p>Failed to save settings. Please check your input.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center">
            <ServerIcon className="h-6 w-6 mr-2 text-secondary-500"/> General Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="platformName" className={labelClass}>Platform Name</label>
              <input type="text" name="platformName" id="platformName" value={settings.platformName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="defaultCurrency" className={labelClass}>Default Currency</label>
              <select name="defaultCurrency" id="defaultCurrency" value={settings.defaultCurrency} onChange={handleChange} className={`${inputClass} text-secondary-700`}>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label htmlFor="adminEmail" className={labelClass}>Admin Notification Email</label>
              <input type="email" name="adminEmail" id="adminEmail" value={settings.adminEmail} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Security & Maintenance */}
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center">
            <ShieldCheckIcon className="h-6 w-6 mr-2 text-secondary-500"/> Security & Maintenance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="maintenanceMode"
                name="maintenanceMode"
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mr-2"
              />
              <label htmlFor="maintenanceMode" className={labelClass}>Enable Maintenance Mode</label>
            </div>
            <p className="text-xs text-secondary-500 ml-6">
              When enabled, public access to the site will be restricted. Admins can still log in.
            </p>
          </div>
        </section>
        
        {/* Notifications */}
        <section className={sectionClass}>
            <h2 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center">
                <BellIcon className="h-6 w-6 mr-2 text-secondary-500"/> Notification Settings
            </h2>
            <div className="flex items-center">
              <input
                id="enableEmailNotifications"
                name="enableEmailNotifications"
                type="checkbox"
                checked={settings.enableEmailNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mr-2"
              />
              <label htmlFor="enableEmailNotifications" className={labelClass}>Enable Email Notifications (for new leads, submissions, etc.)</label>
            </div>
             <p className="text-xs text-secondary-500 ml-6 mt-1">
              Controls system-wide email notifications to admins and users.
            </p>
        </section>

        {/* Placeholder sections */}
        <section className={sectionClass}>
            <h2 className="text-xl font-semibold text-secondary-700 mb-4">API Integrations (Placeholder)</h2>
            <p className="text-secondary-500">Configure third-party API keys and settings here (e.g., payment gateways, email services).</p>
        </section>

        <section className={sectionClass}>
            <h2 className="text-xl font-semibold text-secondary-700 mb-4">Content Management (Placeholder)</h2>
            <p className="text-secondary-500">Manage terms of service, privacy policy, FAQ content, etc.</p>
        </section>

        <div className="pt-6 flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;