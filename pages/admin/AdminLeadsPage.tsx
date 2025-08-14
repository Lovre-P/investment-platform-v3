
import React, { useEffect, useState, useCallback } from 'react';
import { Lead, Investment } from '../../types';
import { getLeads, updateLeadStatus, bulkDeleteLeads } from '../../services/leadService';
import { getInvestments } from '../../services/investmentService'; // To display investment title
import { logError, getUserFriendlyErrorMessage, withRetry } from '../../utils/errorHandling';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../constants';

// Utility function for consistent status styling
const getStatusStyles = (status: Lead['status']): string => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800';
    case 'Contacted':
      return 'bg-yellow-100 text-yellow-800';
    case 'Converted':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]); // For mapping investmentId to title
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [currentLeadForStatusEdit, setCurrentLeadForStatusEdit] = useState<Lead | null>(null);
  const [newStatus, setNewStatus] = useState<Lead['status'] | ''>('');

  // Selection state for visible rows only (pagination-friendly)
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearSelection = () => setSelectedIds({});

  const selectedCount = Object.values(selectedIds).filter(Boolean).length;

  const handleBulkDelete = async () => {
    if (selectedCount === 0) return;
    const ids = Object.keys(selectedIds).filter(id => selectedIds[id]);
    const confirmed = window.confirm(`Are you sure you want to delete ${ids.length} selected lead${ids.length > 1 ? 's' : ''}?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await bulkDeleteLeads(ids);
      clearSelection();
      await fetchAllData();
    } catch (err) {
      logError(err, 'AdminLeadsPage bulkDeleteLeads', { component: 'AdminLeadsPage', action: 'bulkDeleteLeads', ids });
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };
  // Keep selection limited to currently visible leads (supports pagination)
  useEffect(() => {
    setSelectedIds(prev => {
      const visible = new Set(leads.map(l => l.id));
      const next: Record<string, boolean> = {};
      for (const id of Object.keys(prev)) {
        if (visible.has(id)) next[id] = prev[id];
      }
      return next;
    });
  }, [leads]);


  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [leadsData, investmentsData] = await withRetry(
        () => Promise.all([
          getLeads(),
          getInvestments()
        ]),
        0, // No retries to prevent rate limiting
        'AdminLeadsPage fetchAllData'
      );
      setLeads(leadsData);
      setInvestments(investmentsData);
    } catch (err) {
      logError(err, 'AdminLeadsPage fetchAllData', {
        component: 'AdminLeadsPage',
        action: 'fetchAllData'
      });
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getInvestmentTitle = (investmentId?: string): string => {
    if (!investmentId) return 'N/A';
    const investment = investments.find(inv => inv.id === investmentId);
    return investment ? investment.title : 'Unknown Investment';
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewModalOpen(true);
  };

  const handleOpenEditStatusModal = (lead: Lead) => {
    setCurrentLeadForStatusEdit(lead);
    setNewStatus(lead.status);
    setIsEditStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!currentLeadForStatusEdit || !newStatus) return;
    setIsLoading(true); // Or a specific loading state for this action
    try {
      await updateLeadStatus(currentLeadForStatusEdit.id, newStatus as Lead['status']);
      fetchAllData(); // Refresh leads
      setIsEditStatusModalOpen(false);
      setCurrentLeadForStatusEdit(null);
    } catch (err: any) {
      logError(err, 'AdminLeadsPage updateLeadStatus', {
        component: 'AdminLeadsPage',
        action: 'updateLeadStatus',
        leadId: currentLeadForStatusEdit?.id,
        status: newStatus
      });
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading && leads.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading leads..." size="lg"/></div>;
  }

  if (error && leads.length === 0) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  const leadStatusOptions: Lead['status'][] = ['New', 'Contacted', 'Converted', 'Rejected'];


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary-800">Manage Leads</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        {/* Bulk actions */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-secondary-600">
            {selectedCount > 0 ? `${selectedCount} selected` : 'Select rows to enable bulk actions'}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" onClick={handleBulkDelete} disabled={selectedCount === 0}>
              Delete Selected
            </Button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-4 py-3">
                {/* Reserved for potential select-all for current page in future */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Investment Interest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-secondary-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <input
                    type="checkbox"
                    checked={!!selectedIds[lead.id]}
                    onChange={() => toggleSelect(lead.id)}
                    className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    aria-label={`Select lead ${lead.name}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{lead.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{lead.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                  {lead.investmentId ? (
                     <Link to={`${PUBLIC_ROUTES.INVESTMENTS}/${lead.investmentId}`} target="_blank" className="hover:text-primary-600 transition-colors">
                        {getInvestmentTitle(lead.investmentId)}
                     </Link>
                  ) : 'General Inquiry'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{new Date(lead.submissionDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(lead.status)}`}>{lead.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewLead(lead)} className="text-indigo-600 hover:text-indigo-900" title="View Details">
                    <EyeIcon className="h-5 w-5"/>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEditStatusModal(lead)} className="text-primary-600 hover:text-primary-900" title="Edit Status">
                    <PencilIcon className="h-5 w-5"/>
                  </Button>
                </td>
              </tr>
            ))}
             {leads.length === 0 && !isLoading && (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-secondary-500">
                        No leads found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Lead Modal */}
      {selectedLead && (
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`Lead Details: ${selectedLead.name}`} size="lg">
          <div className="space-y-6">
            {/* Contact Information Section */}
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-primary-700">Name:</span>
                  <span className="ml-2 text-primary-600">{selectedLead.name}</span>
                </div>
                <div>
                  <span className="font-medium text-primary-700">Email:</span>
                  <a href={`mailto:${selectedLead.email}`} className="ml-2 text-primary-600 hover:underline">{selectedLead.email}</a>
                </div>
                {selectedLead.phone && (
                  <div>
                    <span className="font-medium text-primary-700">Phone:</span>
                    <a href={`tel:${selectedLead.phone}`} className="ml-2 text-primary-600 hover:underline">{selectedLead.phone}</a>
                  </div>
                )}
                <div>
                  <span className="font-medium text-primary-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(selectedLead.status)}`}>{selectedLead.status}</span>
                </div>
              </div>
            </div>

            {/* Lead Details Section */}
            <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
                Lead Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-secondary-700">Submitted:</span>
                  <span className="ml-2 text-secondary-600">{new Date(selectedLead.submissionDate).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-secondary-700">Investment Interest:</span>
                  <span className="ml-2 text-secondary-600">{selectedLead.investmentId ? getInvestmentTitle(selectedLead.investmentId) : 'General Inquiry'}</span>
                </div>
                <div>
                  <span className="font-medium text-secondary-700 block mb-2">Message:</span>
                  <div className="bg-white p-3 rounded-md border border-secondary-200 text-secondary-600 whitespace-pre-wrap">
                    {selectedLead.message}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-secondary-200 flex justify-end">
            <Button variant="primary" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}

      {/* Edit Lead Status Modal */}
      {currentLeadForStatusEdit && (
        <Modal isOpen={isEditStatusModalOpen} onClose={() => setIsEditStatusModalOpen(false)} title={`Update Status for ${currentLeadForStatusEdit.name}`} size="md">
            <div className="modal-form space-y-6">
                {/* Status Update Section */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-4">
                    <h3 className="text-slate-900 font-semibold mb-4">Status Update</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="leadStatus" className="block text-sm font-semibold text-slate-700 mb-2">New Status *</label>
                            <select
                                id="leadStatus"
                                name="leadStatus"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value as Lead['status'])}
                                className="w-full mt-1 px-4 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-500 appearance-none pr-10"
                            >
                                <option value="" disabled>Select new status</option>
                                {leadStatusOptions.map(statusOpt => (
                                    <option key={statusOpt} value={statusOpt}>{statusOpt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <strong>Current Status:</strong> {currentLeadForStatusEdit.status}
                            </p>
                        </div>
                    </div>
                </div>



                {/* Form Actions */}
                <div className="pt-6 border-t border-secondary-200">
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setIsEditStatusModalOpen(false)} size="md">
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleStatusUpdate} isLoading={isLoading} size="md" className="min-w-[120px]">
                            {isLoading ? 'Saving...' : 'Save Status'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
      )}

    </div>
  );
};

export default AdminLeadsPage;