
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Investment, InvestmentStatus } from '../../types';
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from '../../services/investmentService';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PencilIcon, TrashIcon, PlusCircleIcon, EyeIcon, FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link, useSearchParams } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../constants';

// InvestmentFormData for the admin modal
type InvestmentFormData = Omit<Investment, 'id' | 'submissionDate' | 'amountRaised'> & { id?: string };

const initialFormData: InvestmentFormData = {
  title: '',
  description: '',
  longDescription: '',
  amountGoal: 0,
  currency: 'USD',
  images: [], // Should be array of strings (URLs)
  category: '',
  status: InvestmentStatus.PENDING,
  submittedBy: 'Admin', // Default for admin created
  submitterEmail: '', // Added field
  apyRange: '',
  minInvestment: 0,
  term: '',
  tags: [] // Should be array of strings
};

const AdminInvestmentsPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvestment, setCurrentInvestment] = useState<InvestmentFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Investment | null>(null);

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvestmentStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'goal_desc' | 'goal_asc' | 'title_asc' | 'title_desc'>('date_desc');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(investments.map(inv => inv.category));
    return Array.from(uniqueCategories).sort();
  }, [investments]);

  const fetchInvestments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInvestments(); // Fetch all initially
      setInvestments(data);
    } catch (err) {
      console.error("Failed to fetch investments:", err);
      setError("Could not load investments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const filteredAndSortedInvestments = useMemo(() => {
    let filtered = [...investments];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.title.toLowerCase().includes(lowerSearchTerm) ||
        inv.id.toLowerCase().includes(lowerSearchTerm) ||
        inv.category.toLowerCase().includes(lowerSearchTerm) ||
        inv.submittedBy.toLowerCase().includes(lowerSearchTerm) ||
        (inv.submitterEmail && inv.submitterEmail.toLowerCase().includes(lowerSearchTerm))
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }
    if (categoryFilter) {
      filtered = filtered.filter(inv => inv.category === categoryFilter);
    }

    switch (sortBy) {
      case 'date_asc':
        return filtered.sort((a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime());
      case 'date_desc':
        return filtered.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
      case 'goal_asc':
        return filtered.sort((a, b) => a.amountGoal - b.amountGoal);
      case 'goal_desc':
        return filtered.sort((a, b) => b.amountGoal - a.amountGoal);
      case 'title_asc':
        return filtered.sort((a,b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return filtered.sort((a,b) => b.title.localeCompare(a.title));
      default:
        return filtered;
    }
  }, [investments, searchTerm, statusFilter, categoryFilter, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
    setSortBy('date_desc');
  };


  useEffect(() => {
    const editId = searchParams.get('edit');
    const createNew = searchParams.get('create');

    if (editId) {
      const investmentToEdit = investments.find(inv => inv.id === editId);
      if (investmentToEdit) {
        setCurrentInvestment({ ...investmentToEdit }); // Investment type has all fields for InvestmentFormData
        setIsEditing(true);
        setIsModalOpen(true);
      }
    } else if (createNew === 'new') {
        handleOpenModal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, investments]); // investments dependency is important here


  const handleOpenModal = (investment?: Investment) => {
    if (investment) {
      setCurrentInvestment({ ...investment }); // Spread all fields from Investment
      setIsEditing(true);
      setSearchParams({ edit: investment.id });
    } else {
      setCurrentInvestment(initialFormData);
      setIsEditing(false);
      setSearchParams({ create: "new" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentInvestment(initialFormData);
    setSearchParams({}); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
     if (type === 'number') {
      setCurrentInvestment(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'tags' || name === 'images') { // Ensure these are treated as arrays of strings
        const valArray = value.split(',').map(item => item.trim()).filter(item => item);
        setCurrentInvestment(prev => ({ ...prev, [name]: valArray as any })); // Cast as any if type struggles
    } else {
      setCurrentInvestment(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitting(true); 

    // Prepare data for API: remove id for create, ensure correct types for array fields
    const investmentDataForApi = { 
        ...currentInvestment,
        tags: Array.isArray(currentInvestment.tags) ? currentInvestment.tags : (currentInvestment.tags as unknown as string)?.split(',').map(t=>t.trim()).filter(t=>t) || [],
        images: Array.isArray(currentInvestment.images) ? currentInvestment.images : (currentInvestment.images as unknown as string)?.split(',').map(t=>t.trim()).filter(t=>t) || [],
    };
    if (!isEditing) {
      delete investmentDataForApi.id;
    }


    try {
      if (isEditing && currentInvestment.id) {
        // For update, ensure we are sending Partial<Investment>
        // Fix: `submissionDate` and `amountRaised` are not present in `investmentDataForApi`
        // because `InvestmentFormData` (the type of `currentInvestment`) omits them.
        // Only `id` needs to be destructured out if it's present in `investmentDataForApi`.
        const { id, ...updateData } = investmentDataForApi;
        await updateInvestment(currentInvestment.id, updateData as Partial<Investment>);
      } else {
        // For create, ensure it matches CreateInvestmentData from service
        // The 'id' is already removed. We need to ensure all required fields for create are present.
        const { id, ...createData } = investmentDataForApi;
        await createInvestment(createData as any); // Cast if type mismatch with service due to Omit differences
      }
      fetchInvestments(); 
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save investment:", err);
      setError("Failed to save investment. Please try again.");
    } finally {
      setIsFormSubmitting(false); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!showDeleteConfirm || showDeleteConfirm.id !== id) return; 
    setIsLoading(true); // Use main loading indicator for delete action
    try {
      await deleteInvestment(id);
      fetchInvestments(); 
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete investment:", err);
      setError("Failed to delete investment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const confirmDelete = (investment: Investment) => {
    setShowDeleteConfirm(investment);
  };

  if (isLoading && investments.length === 0) { 
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading investments..." size="lg"/></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-800">Manage Investments</h1>
        <Button onClick={() => handleOpenModal()} variant="primary" leftIcon={<PlusCircleIcon />}>
          Add Investment
        </Button>
      </div>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {/* Filters and Search Section */}
      <section className="bg-white p-4 rounded-lg shadow-md space-y-3 md:space-y-0 md:flex md:flex-wrap md:items-end md:justify-between gap-3">
        <div className="relative flex-grow md:max-w-sm">
          <label htmlFor="searchTermAdmin" className="block text-xs font-medium text-secondary-600 mb-1">Search</label>
          <input
            id="searchTermAdmin"
            type="text"
            placeholder="ID, Title, Category, Submitter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400 absolute left-3 top-1/2 transform translate-y-[0.1rem]" />
        </div>

        <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[150px]">
          <label htmlFor="statusFilterAdmin" className="block text-xs font-medium text-secondary-600 mb-1">Status</label>
          <select
            id="statusFilterAdmin"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvestmentStatus | '')}
            className="w-full appearance-none pl-3 pr-8 py-2 border border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
          >
            <option value="">All Statuses</option>
            {Object.values(InvestmentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <ChevronDownIcon className="h-4 w-4 text-secondary-400 absolute right-2.5 top-1/2 transform translate-y-[0.1rem] pointer-events-none"/>
        </div>
        
        <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[150px]">
          <label htmlFor="categoryFilterAdmin" className="block text-xs font-medium text-secondary-600 mb-1">Category</label>
          <select
            id="categoryFilterAdmin"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 border border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
           <ChevronDownIcon className="h-4 w-4 text-secondary-400 absolute right-2.5 top-1/2 transform translate-y-[0.1rem] pointer-events-none"/>
        </div>

        <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[180px]">
           <label htmlFor="sortByAdmin" className="block text-xs font-medium text-secondary-600 mb-1">Sort By</label>
           <select
            id="sortByAdmin"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full appearance-none pl-3 pr-8 py-2 border border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="goal_desc">Goal (High-Low)</option>
            <option value="goal_asc">Goal (Low-High)</option>
          </select>
          <ChevronDownIcon className="h-4 w-4 text-secondary-400 absolute right-2.5 top-1/2 transform translate-y-[0.1rem] pointer-events-none"/>
        </div>
        <button 
            onClick={resetFilters}
            className="w-full sm:w-auto px-3 py-2 border border-secondary-300 rounded-md text-secondary-700 hover:bg-secondary-50 transition-colors flex items-center justify-center text-sm"
        >
            <FunnelIcon className="h-4 w-4 mr-1.5 text-secondary-500" /> Reset
        </button>
      </section>

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Goal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Raised</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Submitted By</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {filteredAndSortedInvestments.map((investment) => (
              <tr key={investment.id} className="hover:bg-secondary-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-secondary-900">{investment.title}</div>
                  <div className="text-xs text-secondary-500">ID: {investment.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{investment.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    investment.status === InvestmentStatus.OPEN ? 'bg-green-100 text-green-800' :
                    investment.status === InvestmentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                    investment.status === InvestmentStatus.FUNDED ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'}`
                  }>
                    {investment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                  {investment.currency} {investment.amountGoal.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                  {investment.currency} {investment.amountRaised.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    <div>{investment.submittedBy}</div>
                    {investment.submitterEmail && <div className="text-xs text-secondary-500">{investment.submitterEmail}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link to={`${PUBLIC_ROUTES.INVESTMENTS}/${investment.id}`} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center p-1 hover:bg-indigo-100 rounded-md transition-colors" title="View Public Page">
                     <EyeIcon className="h-5 w-5"/>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(investment)} className="text-primary-600 hover:text-primary-900" title="Edit">
                    <PencilIcon className="h-5 w-5"/>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => confirmDelete(investment)} className="text-red-600 hover:text-red-900" title="Delete">
                    <TrashIcon className="h-5 w-5"/>
                  </Button>
                </td>
              </tr>
            ))}
            {filteredAndSortedInvestments.length === 0 && !isLoading && (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-secondary-500">
                        No investments match your criteria.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? 'Edit Investment' : 'Add New Investment'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1"> {/* Added padding for scrollbar */}
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title-modal" className="block text-sm font-medium text-secondary-700">Title</label>
                    <input type="text" name="title" id="title-modal" value={currentInvestment.title} onChange={handleChange} required className="form-input"/>
                </div>
                <div>
                    <label htmlFor="category-modal" className="block text-sm font-medium text-secondary-700">Category</label>
                    <select name="category" id="category-modal" value={currentInvestment.category} onChange={handleChange} required className="form-select">
                        <option value="">Select Category</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Technology">Technology</option>
                        <option value="Renewable Energy">Renewable Energy</option>
                        <option value="Small Business">Small Business</option>
                         <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="description-modal" className="block text-sm font-medium text-secondary-700">Short Description</label>
                <textarea name="description" id="description-modal" value={currentInvestment.description} onChange={handleChange} rows={2} className="form-textarea"></textarea>
            </div>
            <div>
                <label htmlFor="longDescription-modal" className="block text-sm font-medium text-secondary-700">Long Description</label>
                <textarea name="longDescription" id="longDescription-modal" value={currentInvestment.longDescription} onChange={handleChange} rows={4} className="form-textarea"></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="amountGoal-modal" className="block text-sm font-medium text-secondary-700">Funding Goal</label>
                    <input type="number" name="amountGoal" id="amountGoal-modal" value={currentInvestment.amountGoal} onChange={handleChange} required className="form-input"/>
                </div>
                <div>
                    <label htmlFor="currency-modal" className="block text-sm font-medium text-secondary-700">Currency</label>
                    <input type="text" name="currency" id="currency-modal" value={currentInvestment.currency} onChange={handleChange} required className="form-input" maxLength={3}/>
                </div>
                 <div>
                    <label htmlFor="minInvestment-modal" className="block text-sm font-medium text-secondary-700">Min. Investment</label>
                    <input type="number" name="minInvestment" id="minInvestment-modal" value={currentInvestment.minInvestment || 0} onChange={handleChange} className="form-input"/>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="apyRange-modal" className="block text-sm font-medium text-secondary-700">APY Range</label>
                    <input type="text" name="apyRange" id="apyRange-modal" value={currentInvestment.apyRange || ''} onChange={handleChange} className="form-input" placeholder="e.g., 5-8%"/>
                </div>
                <div>
                    <label htmlFor="term-modal" className="block text-sm font-medium text-secondary-700">Term</label>
                    <input type="text" name="term" id="term-modal" value={currentInvestment.term || ''} onChange={handleChange} className="form-input" placeholder="e.g., 3 Years"/>
                </div>
                <div>
                    <label htmlFor="status-modal" className="block text-sm font-medium text-secondary-700">Status</label>
                    <select name="status" id="status-modal" value={currentInvestment.status} onChange={handleChange} required className="form-select">
                        {Object.values(InvestmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="submittedBy-modal" className="block text-sm font-medium text-secondary-700">Submitted By (Name)</label>
                <input type="text" name="submittedBy" id="submittedBy-modal" value={currentInvestment.submittedBy} onChange={handleChange} className="form-input"/>
            </div>
            <div>
                <label htmlFor="submitterEmail-modal" className="block text-sm font-medium text-secondary-700">Submitter Email</label>
                <input type="email" name="submitterEmail" id="submitterEmail-modal" value={currentInvestment.submitterEmail || ''} onChange={handleChange} className="form-input"/>
            </div>

            <div>
                <label htmlFor="images-modal" className="block text-sm font-medium text-secondary-700">Image URLs (comma-separated)</label>
                <textarea name="images" id="images-modal" value={Array.isArray(currentInvestment.images) ? currentInvestment.images.join(', ') : currentInvestment.images} onChange={handleChange} rows={2} className="form-textarea" placeholder="https://example.com/image1.jpg, ..."></textarea>
            </div>
             <div>
                <label htmlFor="tags-modal" className="block text-sm font-medium text-secondary-700">Tags (comma-separated)</label>
                <input type="text" name="tags" id="tags-modal" value={Array.isArray(currentInvestment.tags) ? currentInvestment.tags.join(', ') : currentInvestment.tags} onChange={handleChange} className="form-input" placeholder="tech, startup, eco-friendly"/>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .form-input, .form-textarea, .form-select {
                  @apply w-full mt-1 px-3 py-2 bg-white text-secondary-700 border border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400 text-sm;
                }
            `}} />

            <div className="pt-4 flex justify-end space-x-2 sticky bottom-0 bg-white pb-1 -mx-1 px-1"> {/* Make buttons sticky */}
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isFormSubmitting}>
                {isEditing ? 'Save Changes' : 'Create Investment'}
              </Button>
            </div>
        </form>
      </Modal>

       {showDeleteConfirm && (
        <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirm Deletion" size="sm">
          <p className="text-secondary-700">
            Are you sure you want to delete the investment: <strong className="font-semibold">{showDeleteConfirm.title}</strong>? This action cannot be undone.
          </p>
          <div className="pt-5 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(showDeleteConfirm.id)} isLoading={isLoading}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminInvestmentsPage;
