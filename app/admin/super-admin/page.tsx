'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  Activity,
  Database,
  Key,
  Eye
} from 'lucide-react';

type SystemStats = {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  superAdmins: number;
  admins: number;
  managers: number;
  regularUsers: number;
  lastLogin: string;
  systemUptime: string;
};

type RecentActivity = {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'success' | 'warning' | 'error' | 'info';
};

export default function SuperAdminPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ email: string, role: string } | null>(null);

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
    
    fetchSystemStats();
    fetchRecentActivity();
  }, []);

  const fetchSystemStats = async () => {
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
        throw new Error('Failed to fetch system stats');
      }

      const data = await response.json();
      const users = data.users;

      // Calculate stats
      const totalUsers = users.length;
      const activeUsers = users.filter((u: any) => u.status === 'active').length;
      const pendingUsers = users.filter((u: any) => u.status === 'pending').length;
      const superAdmins = users.filter((u: any) => u.role === 'super_admin').length;
      const admins = users.filter((u: any) => u.role === 'admin').length;
      const managers = users.filter((u: any) => u.role === 'manager').length;
      const regularUsers = users.filter((u: any) => u.role === 'user').length;

      setStats({
        totalUsers,
        activeUsers,
        pendingUsers,
        superAdmins,
        admins,
        managers,
        regularUsers,
        lastLogin: new Date().toISOString(),
        systemUptime: '99.9%'
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    // Mock recent activity data - in a real app, this would come from an API
    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        action: 'User created',
        user: 'john@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        type: 'success'
      },
      {
        id: '2',
        action: 'Role updated',
        user: 'jane@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        type: 'info'
      },
      {
        id: '3',
        action: 'Login failed',
        user: 'unknown@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        type: 'warning'
      },
      {
        id: '4',
        action: 'System backup completed',
        user: 'System',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        type: 'success'
      }
    ];
    setRecentActivity(mockActivity);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
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

  // Check if current user is super admin
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p className="font-bold">Access Denied</p>
          <p>You need super administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brana-green">Super Admin Dashboard</h1>
        <p className="text-gray-500">System overview and administration tools</p>
      </div>

      {/* System Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Super Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.superAdmins || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Role Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Super Admins</span>
              <span className="font-semibold text-red-600">{stats?.superAdmins || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Admins</span>
              <span className="font-semibold text-purple-600">{stats?.admins || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Managers</span>
              <span className="font-semibold text-orange-600">{stats?.managers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Regular Users</span>
              <span className="font-semibold text-blue-600">{stats?.regularUsers || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="font-semibold text-green-600">{stats?.systemUptime || '99.9%'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Login</span>
              <span className="font-semibold text-gray-600">
                {stats?.lastLogin ? new Date(stats.lastLogin).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database Status</span>
              <span className="font-semibold text-green-600 flex items-center">
                <Database className="h-4 w-4 mr-1" />
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">by {activity.user}</p>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-brana-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
          <UserPlus className="h-5 w-5 mr-2" />
          Create New User
        </button>
        <button className="bg-brana-purple text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center">
          <Settings className="h-5 w-5 mr-2" />
          System Settings
        </button>
        <button className="bg-brana-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          View Reports
        </button>
      </div>
    </div>
  );
}

