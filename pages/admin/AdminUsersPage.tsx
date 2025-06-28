
import React, { useEffect, useState, useCallback } from 'react';
import { User, UserRole } from '../../types';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import { logError, getUserFriendlyErrorMessage, withRetry } from '../../utils/errorHandling';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PencilIcon, TrashIcon, PlusCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'react-router-dom';

type UserFormData = Omit<User, 'id' | 'joinDate'> & { id?: string; password?: string }; // Add password for creation form

const initialFormData: UserFormData = {
  username: '',
  email: '',
  role: UserRole.USER,
  password: ''
};

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await withRetry(
        () => getUsers(),
        2,
        'AdminUsersPage fetchUsers'
      );
      setUsers(data);
    } catch (err) {
      logError(err, 'AdminUsersPage fetchUsers', {
        component: 'AdminUsersPage',
        action: 'fetchUsers'
      });
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  useEffect(() => {
    const editId = searchParams.get('edit');
    const createNew = searchParams.get('create');

    if (editId) {
      const userToEdit = users.find(u => u.id === editId);
      if (userToEdit) {
        setCurrentUser({ ...userToEdit, password: '' }); // Don't prefill password
        setIsEditing(true);
        setIsModalOpen(true);
      }
    } else if (createNew === 'new') {
        handleOpenModal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, users]);


  const handleOpenModal = (user?: User) => {
    if (user) {
      setCurrentUser({ ...user, password: '' }); // Don't prefill password
      setIsEditing(true);
      setSearchParams({ edit: user.id });
    } else {
      setCurrentUser(initialFormData);
      setIsEditing(false);
      setSearchParams({ create: "new" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentUser(initialFormData);
    setSearchParams({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add specific loading state for form submission if needed
    
    const userDataForApi: Partial<User> & { password?: string } = { 
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
    };
    if (currentUser.password && !isEditing) { // Only include password for new users if provided
        userDataForApi.password = currentUser.password; // In real app, backend handles hashing
    }


    try {
      if (isEditing && currentUser.id) {
        // For edit, don't send password unless it's being changed.
        const { password, ...editData } = currentUser; // eslint-disable-line @typescript-eslint/no-unused-vars
        await updateUser(currentUser.id, editData);
      } else {
        await createUser(userDataForApi as Omit<User, 'id' | 'joinDate'>);
      }
      fetchUsers();
      handleCloseModal();
    } catch (err: any) {
      logError(err, 'AdminUsersPage saveUser', {
        component: 'AdminUsersPage',
        action: isEditing ? 'updateUser' : 'createUser',
        userId: currentUser.id
      });
      setError(getUserFriendlyErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!showDeleteConfirm || showDeleteConfirm.id !== id) return;
    try {
      await deleteUser(id);
      fetchUsers();
      setShowDeleteConfirm(null);
    } catch (err: any) {
      logError(err, 'AdminUsersPage deleteUser', {
        component: 'AdminUsersPage',
        action: 'deleteUser',
        userId: id
      });
      setError(getUserFriendlyErrorMessage(err));
    }
  };
  
  const confirmDelete = (user: User) => {
    setShowDeleteConfirm(user);
  };


  if (isLoading && users.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading users..." size="lg"/></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-800">Manage Users</h1>
        <Button onClick={() => handleOpenModal()} variant="primary" leftIcon={<PlusCircleIcon />}>
          Add User
        </Button>
      </div>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-secondary-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserCircleIcon className="h-8 w-8 text-secondary-400 mr-3"/>
                    <div>
                        <div className="text-sm font-medium text-secondary-900">{user.username}</div>
                        <div className="text-xs text-secondary-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === UserRole.ADMIN ? 'bg-accent-100 text-accent-800' : 'bg-primary-100 text-primary-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(user)} className="text-primary-600 hover:text-primary-900" title="Edit">
                    <PencilIcon className="h-5 w-5"/>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => confirmDelete(user)} className="text-red-600 hover:text-red-900" title="Delete">
                    <TrashIcon className="h-5 w-5"/>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Create/Edit User Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? 'Edit User' : 'Add New User'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-secondary-700">Username</label>
                <input type="text" name="username" id="username" value={currentUser.username} onChange={handleChange} required className="form-input"/>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700">Email</label>
                <input type="email" name="email" id="email" value={currentUser.email} onChange={handleChange} required className="form-input"/>
            </div>
            {!isEditing && ( // Only show password field for new users
              <div>
                  <label htmlFor="password" className="block text-sm font-medium text-secondary-700">Password</label>
                  <input type="password" name="password" id="password" value={currentUser.password || ''} onChange={handleChange} required={!isEditing} className="form-input" placeholder={isEditing ? "Leave blank to keep current" : "Enter password"}/>
              </div>
            )}
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-secondary-700">Role</label>
                <select name="role" id="role" value={currentUser.role} onChange={handleChange} required className="form-select">
                    <option value={UserRole.USER}>User</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                </select>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .form-input, .form-select { @apply w-full mt-1 px-3 py-2 bg-white text-secondary-700 border border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400; }
            `}} />
             <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isLoading}> {/* Consider specific loading state */}
                {isEditing ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
       {showDeleteConfirm && (
        <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirm Deletion" size="sm">
          <p className="text-secondary-700">
            Are you sure you want to delete the user: <strong className="font-semibold">{showDeleteConfirm.username} ({showDeleteConfirm.email})</strong>? This action cannot be undone.
          </p>
          <div className="pt-5 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(showDeleteConfirm.id)} isLoading={isLoading}> {/* Consider specific loading state */}
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsersPage;