
import React, { useEffect, useState, useCallback } from 'react';
import { Investment, InvestmentStatus } from '../../types';
// Fix: Import updateInvestment, it was missing.
import { getInvestments, approveInvestment, deleteInvestment, updateInvestment } from '../../services/investmentService';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
// Fix: Import PencilIcon
import { CheckCircleIcon, XCircleIcon, EyeIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
// Fix: Import ADMIN_ROUTES
import { PUBLIC_ROUTES, ADMIN_ROUTES } from '../../constants';


const AdminPendingInvestmentsPage: React.FC = () => {
  const [pendingInvestments, setPendingInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<Investment | null>(null);
  const [confirmActionType, setConfirmActionType] = useState<'approve' | 'reject' | 'delete' | null>(null);

  const fetchPendingInvestments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allInvestments = await getInvestments({ status: InvestmentStatus.PENDING });
      setPendingInvestments(allInvestments);
    } catch (err) {
      console.error("Failed to fetch pending investments:", err);
      setError("Could not load pending investments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingInvestments();
  }, [fetchPendingInvestments]);
  
  const handleActionConfirm = (investment: Investment, action: 'approve' | 'reject' | 'delete') => {
    setActionTarget(investment);
    setConfirmActionType(action);
  };

  const executeAction = async () => {
    if (!actionTarget || !confirmActionType) return;
    
    setIsLoading(true); // Consider a more granular loading state
    try {
      switch (confirmActionType) {
        case 'approve':
          await approveInvestment(actionTarget.id);
          break;
        case 'reject':
          // Reject could mean setting status to 'Closed' or a specific 'Rejected' status
          // For now, we'll use a 'Closed' status as a placeholder for rejection.
          await updateInvestment(actionTarget.id, { status: InvestmentStatus.CLOSED });
          break;
        case 'delete':
            await deleteInvestment(actionTarget.id);
            break;
      }
      fetchPendingInvestments(); // Refresh list
    } catch (err) {
      console.error(`Failed to ${confirmActionType} investment:`, err);
      setError(`Failed to ${confirmActionType} investment. Please try again.`);
    } finally {
      setIsLoading(false);
      setActionTarget(null);
      setConfirmActionType(null);
    }
  };


  if (isLoading && pendingInvestments.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading pending investments..." size="lg"/></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary-800">Pending Investments for Review</h1>

      {pendingInvestments.length === 0 && !isLoading && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <CheckCircleIcon className="h-16 w-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold text-secondary-700">All Clear!</h2>
          <p className="text-secondary-600">There are no investments currently pending approval.</p>
        </div>
      )}

      {pendingInvestments.length > 0 && (
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Submitted By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Date Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Goal</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {pendingInvestments.map((investment) => (
                <tr key={investment.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-secondary-900">{investment.title}</div>
                    <div className="text-xs text-secondary-500">{investment.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{investment.submittedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {new Date(investment.submissionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {investment.currency} {investment.amountGoal.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link to={`${PUBLIC_ROUTES.INVESTMENTS}/${investment.id}?preview=true`} target="_blank" rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center p-1 hover:bg-indigo-100 rounded-md transition-colors" title="View Details (as public)">
                       <EyeIcon className="h-5 w-5"/>
                    </Link>
                     <Link to={`${ADMIN_ROUTES.INVESTMENTS}?edit=${investment.id}`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center p-1 hover:bg-blue-100 rounded-md transition-colors" title="Edit before approval">
                       <PencilIcon className="h-5 w-5"/> {/* Using Pencil from heroicons/react/24/outline */}
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleActionConfirm(investment, 'approve')} className="text-green-600 hover:text-green-900" title="Approve">
                      <CheckCircleIcon className="h-5 w-5"/>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleActionConfirm(investment, 'reject')} className="text-yellow-600 hover:text-yellow-900" title="Reject">
                      <XCircleIcon className="h-5 w-5"/>
                    </Button>
                     <Button variant="ghost" size="sm" onClick={() => handleActionConfirm(investment, 'delete')} className="text-red-600 hover:text-red-900" title="Delete Permanently">
                      <TrashIcon className="h-5 w-5"/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {actionTarget && confirmActionType && (
        <Modal 
            isOpen={!!actionTarget} 
            onClose={() => { setActionTarget(null); setConfirmActionType(null);}} 
            title={`Confirm ${confirmActionType.charAt(0).toUpperCase() + confirmActionType.slice(1)}`} 
            size="md"
        >
          <p className="text-secondary-700">
            Are you sure you want to <strong className="font-semibold">{confirmActionType}</strong> the investment: <br/>
            <strong className="font-semibold block mt-1">{actionTarget.title}</strong>?
          </p>
          {confirmActionType === 'reject' && <p className="text-sm text-yellow-700 mt-2">This will typically mark the investment as 'Closed' or a similar status indicating it was not approved.</p>}
          {confirmActionType === 'delete' && <p className="text-sm text-red-700 mt-2">This action is permanent and cannot be undone.</p>}
          <div className="pt-5 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => { setActionTarget(null); setConfirmActionType(null);}}>Cancel</Button>
            <Button 
              variant={confirmActionType === 'approve' ? 'primary' : (confirmActionType === 'delete' ? 'danger' : 'secondary')} 
              onClick={executeAction} 
              isLoading={isLoading}
            >
              {confirmActionType.charAt(0).toUpperCase() + confirmActionType.slice(1)}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPendingInvestmentsPage;