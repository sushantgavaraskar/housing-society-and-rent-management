import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Bell, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Home,
  FileText
} from 'lucide-react';
import { getAdminDashboard, getOwnerDashboard, getTenantDashboard } from '../services/dashboardService';
import { showToast } from '../utils/toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSocieties: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingComplaints: 0,
    recentAnnouncements: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let dashboardData;
        
        switch (user?.role) {
          case 'admin':
            dashboardData = await getAdminDashboard();
            break;
          case 'owner':
            dashboardData = await getOwnerDashboard();
            break;
          case 'tenant':
            dashboardData = await getTenantDashboard();
            break;
          default:
            dashboardData = {
              totalSocieties: 0,
              totalUsers: 0,
              totalRevenue: 0,
              pendingComplaints: 0,
              recentAnnouncements: [],
              recentActivities: []
            };
        }
        
        setStats(dashboardData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        showToast('Failed to load dashboard data', 'error');
        // Fallback to mock data if API fails
        setStats({
          totalSocieties: 5,
          totalUsers: 150,
          totalRevenue: 250000,
          pendingComplaints: 8,
          recentAnnouncements: [
            { id: 1, title: 'Monthly Maintenance Due', type: 'maintenance', date: '2024-01-15' },
            { id: 2, title: 'Society Meeting Notice', type: 'meeting', date: '2024-01-14' },
            { id: 3, title: 'Water Supply Maintenance', type: 'maintenance', date: '2024-01-13' }
          ],
          recentActivities: [
            { id: 1, type: 'payment', message: 'Rent payment received from Flat 101', time: '2 hours ago' },
            { id: 2, type: 'complaint', message: 'New complaint registered by Flat 203', time: '4 hours ago' },
            { id: 3, type: 'user', message: 'New tenant registered in Flat 305', time: '1 day ago' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard stats={stats} />;
      case 'owner':
        return <OwnerDashboard stats={stats} />;
      case 'tenant':
        return <TenantDashboard stats={stats} />;
      default:
        return <DefaultDashboard stats={stats} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>
      
      {getRoleBasedContent()}
    </div>
  );
};

const AdminDashboard = ({ stats }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Building2 className="h-8 w-8 text-primary-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Societies</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalSocieties}</p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Users className="h-8 w-8 text-success-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-warning-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue?.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <MessageSquare className="h-8 w-8 text-error-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Complaints</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.pendingComplaints}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activities */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Announcements</h3>
          <div className="space-y-3">
            {stats.recentAnnouncements?.map((announcement) => (
              <div key={announcement.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Bell className="h-5 w-5 text-primary-600 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                  <p className="text-xs text-gray-500">{announcement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {stats.recentActivities?.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mr-3">
                  {activity.type === 'payment' && <DollarSign className="h-5 w-5 text-success-600" />}
                  {activity.type === 'complaint' && <MessageSquare className="h-5 w-5 text-error-600" />}
                  {activity.type === 'user' && <User className="h-5 w-5 text-primary-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OwnerDashboard = ({ stats }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Home className="h-8 w-8 text-primary-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">My Properties</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalProperties || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-success-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
            <p className="text-2xl font-semibold text-gray-900">₹{stats.monthlyRent?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Users className="h-8 w-8 text-warning-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Tenants</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.activeTenants || 0}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Property Overview */}
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Overview</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.properties?.map((property) => (
            <div key={property.id} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">{property.name}</h4>
              <p className="text-sm text-gray-600">{property.address}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">Rent: ₹{property.rent}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  property.status === 'occupied' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {property.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TenantDashboard = ({ stats }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Home className="h-8 w-8 text-primary-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">My Flat</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.flatNumber || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-warning-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
            <p className="text-2xl font-semibold text-gray-900">₹{stats.monthlyRent?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FileText className="h-8 w-8 text-error-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Bills</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.pendingBills || 0}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Notifications */}
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
        <div className="space-y-3">
          {stats.recentAnnouncements?.map((announcement) => (
            <div key={announcement.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Bell className="h-5 w-5 text-primary-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                <p className="text-xs text-gray-500">{announcement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DefaultDashboard = ({ stats }) => (
  <div className="space-y-6">
    <div className="card p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Housing Society Management</h3>
        <p className="text-gray-600">Please contact your administrator to set up your account.</p>
      </div>
    </div>
  </div>
);

export default Dashboard; 