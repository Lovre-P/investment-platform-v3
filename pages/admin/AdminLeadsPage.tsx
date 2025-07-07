
import React, { useEffect, useState, useCallback } from 'react';
import { Lead, Investment } from '../../types';
import { getLeads, updateLeadStatus } from '../../services/leadService';
import { getInvestments } from '../../services/investmentService'; // To display investment title
import { logError, getUserFriendlyErrorMessage, withRetry } from '../../utils/errorHandling';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../constants';


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
    } catch (err) {
        console.error("Failed to update lead status:", err);
        setError("Failed to update lead status.");
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
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
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
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}>{lead.status}</span>
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
                    <td colSpan={6} className="text-center py-10 text-secondary-500">
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
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedLead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    selectedLead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                    selectedLead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                    selectedLead.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{selectedLead.status}</span>
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
                <div className="form-section">
                    <h3>Status Update</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="leadStatus">New Status *</label>
                            <select
                                id="leadStatus"
                                name="leadStatus"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value as Lead['status'])}
                                className="form-select"
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

                <style dangerouslySetInnerHTML={{ __html: `
                    .form-input, .form-textarea, .form-select {
                      width: 100% !important;
                      max-width: 100% !important;
                      margin-top: 0.25rem !important;
                      padding: 0.75rem 1rem !important;
                      background-color: white !important;
                      color: #374151 !important;
                      border: 1px solid #d1d5db !important;
                      border-radius: 0.5rem !important;
                      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
                      transition: all 0.2s ease-in-out !important;
                      font-weight: 400 !important;
                      font-size: 0.875rem !important;
                      line-height: 1.25rem !important;
                      box-sizing: border-box !important;
                    }
                    .form-select {
                      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") !important;
                      background-position: right 0.5rem center !important;
                      background-repeat: no-repeat !important;
                      background-size: 1.5em 1.5em !important;
                      padding-right: 2.5rem !important;
                      appearance: none !important;
                    }
                    .form-select:hover {
                      border-color: #6b7280 !important;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                      transform: translateY(-1px) !important;
                    }
                    .form-select:focus {
                      outline: none !important;
                      border-color: #3b82f6 !important;
                      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                      transform: translateY(-1px) !important;
                    }

                    /* Enhanced label styling */
                    .modal-form label {
                      display: block !important;
                      font-size: 0.875rem !important;
                      font-weight: 600 !important;
                      color: #374151 !important;
                      margin-bottom: 0.5rem !important;
                      line-height: 1.25rem !important;
                    }

                    /* Section styling */
                    .form-section {
                      background-color: #f8fafc !important;
                      padding: 1.5rem !important;
                      border-radius: 0.75rem !important;
                      border: 1px solid #e2e8f0 !important;
                      margin-bottom: 1rem !important;
                    }

                    .form-section h3 {
                      font-size: 1rem !important;
                      font-weight: 600 !important;
                      color: #1e293b !important;
                      margin-bottom: 1rem !important;
                      display: flex !important;
                      align-items: center !important;
                    }

                    .form-section h3::before {
                      content: '' !important;
                      width: 0.5rem !important;
                      height: 0.5rem !important;
                      background-color: #3b82f6 !important;
                      border-radius: 50% !important;
                      margin-right: 0.75rem !important;
                    }
                `}} />

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