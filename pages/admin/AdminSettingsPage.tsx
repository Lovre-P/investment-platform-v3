
import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import {
  CogIcon, ServerIcon, ShieldCheckIcon, BellIcon, TagIcon,
  PlusIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { InvestmentCategory, PlatformSetting } from '../../types';
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryUsage } from '../../services/categoryService';
import { getSettings, bulkUpdateSettings } from '../../services/settingsService';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsData {
  platform_name: string;
  default_currency: string;
  admin_email: string;
  maintenance_mode: boolean;
  enable_email_notifications: boolean;
  max_investment_images: number;
  min_investment_amount: number;
  platform_fee_percentage: number;
  allow_public_submissions: boolean;
  require_admin_approval: boolean;
  contact_email: string;
  support_phone: string;
  company_address: string;
  terms_of_service_url: string;
  privacy_policy_url: string;
  enable_lead_notifications: boolean;
  enable_investment_notifications: boolean;
}

interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

const AdminSettingsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({
    platform_name: '',
    default_currency: 'EUR',
    admin_email: '',
    maintenance_mode: false,
    enable_email_notifications: true,
    max_investment_images: 5,
    min_investment_amount: 1000,
    platform_fee_percentage: 2.5,
    allow_public_submissions: true,
    require_admin_approval: true,
    contact_email: '',
    support_phone: '',
    company_address: '',
    terms_of_service_url: '/terms',
    privacy_policy_url: '/privacy',
    enable_lead_notifications: true,
    enable_investment_notifications: true
  });
  const [categories, setCategories] = useState<InvestmentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'categories' | 'notifications' | 'advanced'>('general');

  // Category management state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<InvestmentCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    description: '',
    isActive: true,
    sortOrder: 0
  });
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [settingsData, categoriesData] = await Promise.all([
        getSettings(false, true) as Promise<Record<string, any>>,
        getCategories(true)
      ]);

      // Convert settings object to form data
      const formData: SettingsData = {
        platform_name: settingsData.platform_name || 'MegaInvest Platform',
        default_currency: settingsData.default_currency || 'EUR',
        admin_email: settingsData.admin_email || 'admin@megainvest.com',
        maintenance_mode: settingsData.maintenance_mode || false,
        enable_email_notifications: settingsData.enable_email_notifications || true,
        max_investment_images: settingsData.max_investment_images || 5,
        min_investment_amount: settingsData.min_investment_amount || 1000,
        platform_fee_percentage: settingsData.platform_fee_percentage || 2.5,
        allow_public_submissions: settingsData.allow_public_submissions ?? true,
        require_admin_approval: settingsData.require_admin_approval ?? true,
        contact_email: settingsData.contact_email || 'contact@megainvest.com',
        support_phone: settingsData.support_phone || '+1-555-0123',
        company_address: settingsData.company_address || '',
        terms_of_service_url: settingsData.terms_of_service_url || '/terms',
        privacy_policy_url: settingsData.privacy_policy_url || '/privacy',
        enable_lead_notifications: settingsData.enable_lead_notifications ?? true,
        enable_investment_notifications: settingsData.enable_investment_notifications ?? true
      };

      setSettings(formData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Convert form data to settings object
      const settingsToUpdate: Record<string, string | number | boolean> = {
        platform_name: settings.platform_name,
        default_currency: settings.default_currency,
        admin_email: settings.admin_email,
        maintenance_mode: settings.maintenance_mode,
        enable_email_notifications: settings.enable_email_notifications,
        max_investment_images: settings.max_investment_images,
        min_investment_amount: settings.min_investment_amount,
        platform_fee_percentage: settings.platform_fee_percentage,
        allow_public_submissions: settings.allow_public_submissions,
        require_admin_approval: settings.require_admin_approval,
        contact_email: settings.contact_email,
        support_phone: settings.support_phone,
        company_address: settings.company_address,
        terms_of_service_url: settings.terms_of_service_url,
        privacy_policy_url: settings.privacy_policy_url,
        enable_lead_notifications: settings.enable_lead_notifications,
        enable_investment_notifications: settings.enable_investment_notifications
      };

      await bulkUpdateSettings(settingsToUpdate);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Category management functions
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError(null);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
      } else {
        await createCategory(categoryForm);
      }

      await loadData(); // Reload categories
      setShowCategoryModal(false);
      resetCategoryForm();
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (category: InvestmentCategory) => {
    try {
      // First check usage
      const usageData = await getCategoryUsage(category.name);

      if (usageData.usageCount > 0) {
        alert(`Cannot delete category "${category.name}" as it is currently used by ${usageData.usageCount} investment(s). Please reassign those investments to other categories first.`);
        return;
      }

      if (!confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
        return;
      }

      await deleteCategory(category.id);
      await loadData(); // Reload categories
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      isActive: true,
      sortOrder: 0
    });
    setEditingCategory(null);
    setCategoryError(null);
  };

  const openCategoryModal = (category?: InvestmentCategory) => {
    if (category) {
      setCategoryForm({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive,
        sortOrder: category.sortOrder
      });
      setEditingCategory(category);
    } else {
      resetCategoryForm();
    }
    setShowCategoryModal(true);
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white text-secondary-700 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm placeholder-secondary-400";
  const labelClass = "block text-sm font-medium text-secondary-700";
  const sectionClass = "bg-white p-6 shadow-lg rounded-xl";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', label: 'General', icon: ServerIcon },
            { id: 'categories', label: 'Categories', icon: TagIcon },
            { id: 'notifications', label: 'Notifications', icon: BellIcon },
            { id: 'advanced', label: 'Advanced', icon: ShieldCheckIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === 'general' && (
          <section className={sectionClass}>
            <h2 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center">
              <ServerIcon className="h-6 w-6 mr-2 text-secondary-500"/> General Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="platform_name" className={labelClass}>Platform Name</label>
                <input
                  type="text"
                  name="platform_name"
                  id="platform_name"
                  value={settings.platform_name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="default_currency" className={labelClass}>Default Currency</label>
                <select
                  name="default_currency"
                  id="default_currency"
                  value={settings.default_currency}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label htmlFor="admin_email" className={labelClass}>Admin Notification Email</label>
                <input
                  type="email"
                  name="admin_email"
                  id="admin_email"
                  value={settings.admin_email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="min_investment_amount" className={labelClass}>Minimum Investment Amount ({settings.default_currency})</label>
                <input
                  type="number"
                  name="min_investment_amount"
                  id="min_investment_amount"
                  value={settings.min_investment_amount}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                  step="100"
                />
              </div>

              <div>
                <label htmlFor="contact_email" className={labelClass}>Public Contact Email</label>
                <input
                  type="email"
                  name="contact_email"
                  id="contact_email"
                  value={settings.contact_email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="support_phone" className={labelClass}>Support Phone Number</label>
                <input
                  type="tel"
                  name="support_phone"
                  id="support_phone"
                  value={settings.support_phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="company_address" className={labelClass}>Company Address</label>
              <textarea
                name="company_address"
                id="company_address"
                value={settings.company_address}
                onChange={handleChange}
                className={inputClass}
                rows={3}
                placeholder="Enter company address for legal documents"
              />
            </div>
          </section>
        )}

        {activeTab === 'categories' && (
          <section className={sectionClass}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-700 flex items-center">
                <TagIcon className="h-6 w-6 mr-2 text-secondary-500"/> Investment Categories
              </h2>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => openCategoryModal()}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-secondary-900">{category.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-sm text-secondary-600 mt-1">{category.description}</p>
                    )}
                    <p className="text-xs text-secondary-500 mt-1">Sort Order: {category.sortOrder}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => openCategoryModal(category)}
                      className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="text-center py-8 text-secondary-500">
                  No categories found. Add your first category to get started.
                </div>
              )}
            </div>
          </section>
        )}
        {activeTab === 'notifications' && (
          <section className={sectionClass}>
            <h2 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center">
              <BellIcon className="h-6 w-6 mr-2 text-secondary-500"/> Notification Settings
            </h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  id="enable_email_notifications"
                  name="enable_email_notifications"
                  type="checkbox"
                  checked={settings.enable_email_notifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mr-3"
                />
                <div>
                  <label htmlFor="enable_email_notifications" className={labelClass}>Master Email Notifications</label>
                  <p className="text-xs text-secondary-500">
                    Master switch for all email notifications. When disabled, no emails will be sent.
                  </p>
                </div>
              </div>

              <div className="pl-6 space-y-4 border-l-2 border-secondary-200">
                <div className="flex items-center">
                  <input
                    id="enable_lead_notifications"
                    name="enable_lead_notifications"
                    type="checkbox"
                    checked={settings.enable_lead_notifications}
                    onChange={handleChange}
                    disabled={!settings.enable_email_notifications}
                    className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mr-3 disabled:opacity-50"
                  />
                  <div>
                    <label htmlFor="enable_lead_notifications" className={labelClass}>Lead Notifications</label>
                    <p className="text-xs text-secondary-500">
                      Send email notifications when new leads are submitted through contact forms.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="enable_investment_notifications"
                    name="enable_investment_notifications"
                    type="checkbox"
                    checked={settings.enable_investment_notifications}
                    onChange={handleChange}
                    disabled={!settings.enable_email_notifications}
                    className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mr-3 disabled:opacity-50"
                  />
                  <div>
                    <label htmlFor="enable_investment_notifications" className={labelClass}>Investment Notifications</label>
                    <p className="text-xs text-secondary-500">
                      Send email notifications when new investment opportunities are submitted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'advanced' && (
          <section className={sectionClass}>
            <h2 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center">
              <ShieldCheckIcon className="h-6 w-6 mr-2 text-secondary-500"/> Advanced Settings
            </h2>

            {/* System Controls */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-secondary-700 mb-4">System Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    id="maintenance_mode"
                    name="maintenance_mode"
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mr-3"
                  />
                  <div>
                    <label htmlFor="maintenance_mode" className={labelClass}>Enable Maintenance Mode</label>
                    <p className="text-xs text-secondary-500">
                      When enabled, public access to the site will be restricted. Admins can still log in.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="allow_public_submissions"
                    name="allow_public_submissions"
                    type="checkbox"
                    checked={settings.allow_public_submissions}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mr-3"
                  />
                  <div>
                    <label htmlFor="allow_public_submissions" className={labelClass}>Allow Public Submissions</label>
                    <p className="text-xs text-secondary-500">
                      Allow non-admin users to submit investment opportunities through the public form.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="require_admin_approval"
                    name="require_admin_approval"
                    type="checkbox"
                    checked={settings.require_admin_approval}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mr-3"
                  />
                  <div>
                    <label htmlFor="require_admin_approval" className={labelClass}>Require Admin Approval</label>
                    <p className="text-xs text-secondary-500">
                      New investments require admin approval before being published.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Configuration */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-secondary-700 mb-4">Platform Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="max_investment_images" className={labelClass}>Max Investment Images</label>
                  <input
                    type="number"
                    name="max_investment_images"
                    id="max_investment_images"
                    value={settings.max_investment_images}
                    onChange={handleChange}
                    className={inputClass}
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label htmlFor="platform_fee_percentage" className={labelClass}>Platform Fee (%)</label>
                  <input
                    type="number"
                    name="platform_fee_percentage"
                    id="platform_fee_percentage"
                    value={settings.platform_fee_percentage}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>

                <div>
                  <label htmlFor="terms_of_service_url" className={labelClass}>Terms of Service URL</label>
                  <input
                    type="text"
                    name="terms_of_service_url"
                    id="terms_of_service_url"
                    value={settings.terms_of_service_url}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="/terms"
                  />
                </div>

                <div>
                  <label htmlFor="privacy_policy_url" className={labelClass}>Privacy Policy URL</label>
                  <input
                    type="text"
                    name="privacy_policy_url"
                    id="privacy_policy_url"
                    value={settings.privacy_policy_url}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="/privacy"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Save Button - only show for settings tabs */}
        {activeTab !== 'categories' && (
          <div className="pt-6 flex justify-end">
            <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
              Save Settings
            </Button>
          </div>
        )}
      </form>
      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                ×
              </button>
            </div>

            {categoryError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
                <p className="text-sm">{categoryError}</p>
              </div>
            )}

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label htmlFor="categoryName" className={labelClass}>Category Name *</label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="categoryDescription" className={labelClass}>Description</label>
                <textarea
                  id="categoryDescription"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  className={inputClass}
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="categorySortOrder" className={labelClass}>Sort Order</label>
                <input
                  type="number"
                  id="categorySortOrder"
                  value={categoryForm.sortOrder}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className={inputClass}
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="categoryActive"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mr-3"
                />
                <label htmlFor="categoryActive" className={labelClass}>Active</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;