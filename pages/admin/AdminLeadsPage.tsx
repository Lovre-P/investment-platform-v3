
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
          <div className="space-y-4">
            <p><strong>Name:</strong> {selectedLead.name}</p>
            <p><strong>Email:</strong> <a href={`mailto:${selectedLead.email}`} className="text-primary-600 hover:underline">{selectedLead.email}</a></p>
            {selectedLead.phone && <p><strong>Phone:</strong> <a href={`tel:${selectedLead.phone}`} className="text-primary-600 hover:underline">{selectedLead.phone}</a></p>}
            <p><strong>Submitted:</strong> {new Date(selectedLead.submissionDate).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedLead.status}</p>
            <p><strong>Investment Interest:</strong> {selectedLead.investmentId ? getInvestmentTitle(selectedLead.investmentId) : 'General Inquiry'}</p>
            <div className="mt-2 pt-2 border-t">
              <p className="font-semibold">Message:</p>
              <p className="text-secondary-600 bg-secondary-50 p-3 rounded-md whitespace-pre-wrap">{selectedLead.message}</p>
            </div>
          </div>
           <div className="pt-5 flex justify-end">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}
      
      {/* Edit Lead Status Modal */}
      {currentLeadForStatusEdit && (
        <Modal isOpen={isEditStatusModalOpen} onClose={() => setIsEditStatusModalOpen(false)} title={`Update Status for ${currentLeadForStatusEdit.name}`} size="md">
            <div className="space-y-4">
                 <div>
                    <label htmlFor="leadStatus" className="block text-sm font-medium text-secondary-700">New Status</label>
                    <select 
                        id="leadStatus" 
                        name="leadStatus"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as Lead['status'])}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-secondary-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm"
                    >
                        <option value="" disabled>Select new status</option>
                        {leadStatusOptions.map(statusOpt => (
                            <option key={statusOpt} value={statusOpt}>{statusOpt}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="pt-5 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsEditStatusModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleStatusUpdate} isLoading={isLoading}>Save Status</Button>
            </div>
        </Modal>
      )}

    </div>
  );
};

export default AdminLeadsPage;