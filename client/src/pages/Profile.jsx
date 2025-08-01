import React, { useState } from 'react';
import { User, Mail, Phone, Building, Edit, Save, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../utils/toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    profilePic: user?.profilePic || ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in context
      updateUser({ ...user, ...profileData });
      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      profilePic: user?.profilePic || ''
    });
    setIsEditing(false);
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'bg-error-100 text-error-800',
      owner: 'bg-primary-100 text-primary-800',
      tenant: 'bg-success-100 text-success-800'
    };
    
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {profileData.profilePic ? (
                    <img
                      src={profileData.profilePic}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary-600" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-1 rounded-full hover:bg-primary-700">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {profileData.name || 'User Name'}
              </h3>
              {getRoleBadge(user?.role)}
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card title="Personal Information">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!isEditing}
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  required
                />
                
                <Input
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                    {getRoleBadge(user?.role)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  rows="3"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter your address..."
                />
              </div>
              
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Settings */}
        <Card title="Account Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Change Password</h4>
                <p className="text-sm text-gray-600">Update your password</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Manage your notification preferences</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </Card>

        {/* Activity Log */}
        <Card title="Recent Activity">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-gray-600">Profile updated</span>
              <span className="text-gray-400 ml-auto">2 hours ago</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-gray-600">Logged in</span>
              <span className="text-gray-400 ml-auto">1 day ago</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              <span className="text-gray-600">Password changed</span>
              <span className="text-gray-400 ml-auto">1 week ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 