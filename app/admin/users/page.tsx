'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Shield, 
  User, 
  Clock, 
  Ban
} from 'lucide-react';

type UserData = {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  createdBy?: string;
  permissions?: string[];
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ email: string, role: string } | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get current user from localStorage
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          setCurrentUser(userInfo);
        } catch (e) {
          console.error('Failed to parse user info', e);
        }
      }
    }
    
    fetchUsers();
  }, []);

  // Fetch all users from the database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user status (approve/reject) or role
  const updateUser = async (userId: string, updates: { status?: string, role?: string }) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Refresh the user list
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Get status badge based on user status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Active</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full flex items-center"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full flex items-center"><Ban className="h-3 w-3 mr-1" /> Inactive</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  // Get role badge based on user role
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full flex items-center"><Shield className="h-3 w-3 mr-1" /> Super Admin</span>;
      case 'admin':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center"><Shield className="h-3 w-3 mr-1" /> Admin</span>;
      case 'manager':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full flex items-center"><User className="h-3 w-3 mr-1" /> Manager</span>;
      case 'user':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center"><User className="h-3 w-3 mr-1" /> User</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">{role}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Check if current user is not an admin, show access denied
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p className="font-bold">Access Denied</p>
          <p>You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-gray-500">Manage user accounts, approve registrations, and assign roles</p>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => updateUser(user._id, { status: 'active' })}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateUser(user._id, { status: 'inactive' })}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    
                    {user.status === 'active' && (
                      <div className="flex justify-end space-x-2">
                        {user.role === 'user' ? (
                          <button
                            onClick={() => updateUser(user._id, { role: 'admin' })}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUser(user._id, { role: 'user' })}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Remove Admin
                          </button>
                        )}
                        <button
                          onClick={() => updateUser(user._id, { status: 'inactive' })}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Deactivate
                        </button>
                      </div>
                    )}
                    
                    {user.status === 'inactive' && (
                      <button
                        onClick={() => updateUser(user._id, { status: 'active' })}
                        className="text-green-600 hover:text-green-900"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 