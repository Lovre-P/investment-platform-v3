
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Investment, InvestmentStatus } from '../../types';
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from '../../services/investmentService';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import FileUpload from '../../components/FileUpload';
import { PencilIcon, TrashIcon, PlusCircleIcon, EyeIcon, FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link, useSearchParams } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../constants';

// InvestmentFormData for the admin modal
type InvestmentFormData = Omit<Investment, 'id' | 'submissionDate' | 'images' | 'tags'> & {
  id?: string;
  images?: string[];
  imageFiles?: FileList | null;
  tags?: string; // Store as string during form editing
};

const initialFormData: InvestmentFormData = {
  title: '',
  description: '',
  longDescription: '',
  amountGoal: 0,
  amountRaised: 0,
  currency: 'EUR',
  images: [], // Should be array of strings (URLs)
  imageFiles: null,
  category: '',
  status: InvestmentStatus.PENDING,
  submittedBy: 'Admin', // Default for admin created
  submitterEmail: '', // Added field
  apyRange: '',
  minInvestment: 0,
  term: '',
  tags: '' // Store as string during form editing
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
      // Convert arrays to strings for form editing
      const investmentForEditing = {
        ...investment,
        tags: Array.isArray(investment.tags) ? investment.tags.join(', ') : (investment.tags || ''),
        images: Array.isArray(investment.images) ? investment.images : []
      };
      setCurrentInvestment(investmentForEditing);
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
    } else if (name === 'tags') {
      // For tags, store the raw string value to allow comma input
      // The conversion to array will happen during form submission
      setCurrentInvestment(prev => ({ ...prev, [name]: value }));
    } else {
      setCurrentInvestment(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (files: FileList | null) => {
    setCurrentInvestment(prev => ({ ...prev, imageFiles: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitting(true);

    // Prepare data for API: remove id for create, ensure correct types for array fields and numbers
    const investmentDataForApi = {
        ...currentInvestment,
        // Ensure numeric fields are numbers, not strings
        amountGoal: typeof currentInvestment.amountGoal === 'string' ? parseFloat(currentInvestment.amountGoal) || 0 : currentInvestment.amountGoal,
        amountRaised: typeof currentInvestment.amountRaised === 'string' ? parseFloat(currentInvestment.amountRaised) || 0 : currentInvestment.amountRaised || 0,
        minInvestment: typeof currentInvestment.minInvestment === 'string' ? parseFloat(currentInvestment.minInvestment) || 0 : currentInvestment.minInvestment || 0,
        // Convert comma-separated strings to arrays for API
        tags: typeof currentInvestment.tags === 'string'
          ? currentInvestment.tags.split(',').map(t => t.trim()).filter(t => t)
          : Array.isArray(currentInvestment.tags) ? currentInvestment.tags : [],
        // Handle image files - convert to temporary URLs for now (backend integration needed)
        images: currentInvestment.imageFiles && currentInvestment.imageFiles.length > 0
          ? Array.from(currentInvestment.imageFiles).map(file => URL.createObjectURL(file))
          : Array.isArray(currentInvestment.images) ? currentInvestment.images : [],
        // Handle empty email - set to a default if empty for create operations
        submitterEmail: currentInvestment.submitterEmail?.trim() || (isEditing ? currentInvestment.submitterEmail : 'admin@megainvest.com'),
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
        <form onSubmit={handleSubmit} className="modal-form space-y-6 max-h-[70vh] overflow-y-auto p-1">
            {/* Basic Information Section */}
            <div className="form-section">
                <h3>Basic Information</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title-modal">Title *</label>
                            <input type="text" name="title" id="title-modal" value={currentInvestment.title} onChange={handleChange} required className="form-input" placeholder="Enter investment title"/>
                        </div>
                        <div>
                            <label htmlFor="category-modal">Category *</label>
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
                        <label htmlFor="description-modal">Short Description</label>
                        <textarea name="description" id="description-modal" value={currentInvestment.description} onChange={handleChange} rows={2} className="form-textarea" placeholder="Brief description of the investment opportunity"></textarea>
                    </div>

                    <div>
                        <label htmlFor="longDescription-modal">Detailed Description</label>
                        <textarea name="longDescription" id="longDescription-modal" value={currentInvestment.longDescription} onChange={handleChange} rows={4} className="form-textarea" placeholder="Comprehensive description including business model, market opportunity, and growth strategy"></textarea>
                    </div>
                </div>
            </div>

            {/* Financial Details Section */}
            <div className="form-section">
                <h3>Financial Details</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="amountGoal-modal">Funding Goal *</label>
                            <input type="number" name="amountGoal" id="amountGoal-modal" value={currentInvestment.amountGoal} onChange={handleChange} required className="form-input" placeholder="100000" min="1000"/>
                        </div>
                        <div>
                            <label htmlFor="currency-modal">Currency *</label>
                            <input type="text" name="currency" id="currency-modal" value={currentInvestment.currency} onChange={handleChange} required className="form-input" maxLength={3} placeholder="EUR"/>
                        </div>
                        <div>
                            <label htmlFor="minInvestment-modal">Minimum Investment</label>
                            <input type="number" name="minInvestment" id="minInvestment-modal" value={currentInvestment.minInvestment || 0} onChange={handleChange} className="form-input" placeholder="10000" min="0"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="apyRange-modal">Expected APY Range</label>
                            <input type="text" name="apyRange" id="apyRange-modal" value={currentInvestment.apyRange || ''} onChange={handleChange} className="form-input" placeholder="5-8%"/>
                        </div>
                        <div>
                            <label htmlFor="term-modal">Investment Term</label>
                            <input type="text" name="term" id="term-modal" value={currentInvestment.term || ''} onChange={handleChange} className="form-input" placeholder="3 Years"/>
                        </div>
                        <div>
                            <label htmlFor="status-modal">Status *</label>
                            <select name="status" id="status-modal" value={currentInvestment.status} onChange={handleChange} required className="form-select">
                                {Object.values(InvestmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submitter Information Section */}
            <div className="form-section">
                <h3>Submitter Information</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="submittedBy-modal">Submitted By (Name)</label>
                            <input type="text" name="submittedBy" id="submittedBy-modal" value={currentInvestment.submittedBy} onChange={handleChange} className="form-input" placeholder="Enter submitter name"/>
                        </div>
                        <div>
                            <label htmlFor="submitterEmail-modal">Submitter Email</label>
                            <input type="email" name="submitterEmail" id="submitterEmail-modal" value={currentInvestment.submitterEmail || ''} onChange={handleChange} className="form-input" placeholder="submitter@example.com"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Details Section */}
            <div className="form-section">
                <h3>Additional Details</h3>
                <div className="space-y-4">
                    <div>
                        <FileUpload
                            id="images-modal"
                            name="imageFiles"
                            label="Upload Images"
                            accept="image/*"
                            multiple={true}
                            maxFiles={5}
                            maxFileSize={5}
                            value={currentInvestment.imageFiles}
                            onChange={handleFileChange}
                        />
                        {Array.isArray(currentInvestment.images) && currentInvestment.images.length > 0 && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm font-medium text-blue-800 mb-2">Existing Images:</p>
                                <div className="flex flex-wrap gap-2">
                                    {currentInvestment.images.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Investment image ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded border border-blue-300"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="tags-modal">Tags (comma-separated)</label>
                        <input type="text" name="tags" id="tags-modal" value={currentInvestment.tags || ''} onChange={handleChange} className="form-input" placeholder="tech, startup, eco-friendly, real-estate"/>
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
                .form-input::placeholder, .form-textarea::placeholder {
                  color: #9ca3af !important;
                  opacity: 1 !important;
                }
                .form-input:hover, .form-textarea:hover, .form-select:hover {
                  border-color: #6b7280 !important;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                  transform: translateY(-1px) !important;
                }
                .form-input:focus, .form-textarea:focus, .form-select:focus {
                  outline: none !important;
                  border-color: #3b82f6 !important;
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                  transform: translateY(-1px) !important;
                }
                .form-input.border-red-500, .form-textarea.border-red-500, .form-select.border-red-500 {
                  border-color: #ef4444 !important;
                  background-color: #fef2f2 !important;
                }
                .form-input.border-red-500:focus, .form-textarea.border-red-500:focus, .form-select.border-red-500:focus {
                  border-color: #ef4444 !important;
                  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                }
                .form-textarea {
                  resize: vertical !important;
                  min-height: 2.5rem !important;
                }
                .form-select {
                  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") !important;
                  background-position: right 0.5rem center !important;
                  background-repeat: no-repeat !important;
                  background-size: 1.5em 1.5em !important;
                  padding-right: 2.5rem !important;
                  appearance: none !important;
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
            <div className="pt-6 border-t border-secondary-200 bg-white sticky bottom-0 -mx-1 px-1">
                <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={handleCloseModal} size="md">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isFormSubmitting} size="md" className="min-w-[140px]">
                        {isFormSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Investment')}
                    </Button>
                </div>
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
