import React, { useState, useEffect } from 'react';
import { Plus, Megaphone, Calendar, User, Edit, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../utils/toast';
import { getAllAnnouncements, getRelevantAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/announcementService';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'normal',
    expiresAt: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      let announcementsData;
      
      if (user?.role === 'admin') {
        announcementsData = await getAllAnnouncements();
      } else {
        announcementsData = await getRelevantAnnouncements();
      }
      
      setAnnouncements(announcementsData || []);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      showToast('Failed to fetch announcements', 'error');
      // Fallback to mock data if API fails
      setAnnouncements([
        {
          id: 1,
          title: 'Monthly Society Meeting',
          content: 'Monthly society meeting will be held on 25th January 2024 at 7:00 PM in the community hall. All residents are requested to attend.',
          priority: 'high',
          createdAt: '2024-01-15',
          expiresAt: '2024-01-25',
          author: 'Admin'
        },
        {
          id: 2,
          title: 'Maintenance Schedule',
          content: 'Regular maintenance work will be carried out on 20th January 2024. Water supply will be affected from 10:00 AM to 2:00 PM.',
          priority: 'normal',
          createdAt: '2024-01-14',
          expiresAt: '2024-01-20',
          author: 'Admin'
        },
        {
          id: 3,
          title: 'Security Update',
          content: 'New security cameras have been installed in the parking area. Please ensure your vehicles are properly parked.',
          priority: 'normal',
          createdAt: '2024-01-13',
          expiresAt: '2024-01-30',
          author: 'Admin'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnnouncement = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        // Update existing announcement
        const updatedData = await updateAnnouncement(editingAnnouncement.id, newAnnouncement);
        const updatedAnnouncements = announcements.map(announcement =>
          announcement.id === editingAnnouncement.id ? updatedData : announcement
        );
        setAnnouncements(updatedAnnouncements);
        showToast('Announcement updated successfully', 'success');
      } else {
        // Create new announcement
        const announcementData = await createAnnouncement(newAnnouncement);
        setAnnouncements([announcementData, ...announcements]);
        showToast('Announcement created successfully', 'success');
      }
      
      setShowModal(false);
      setEditingAnnouncement(null);
      setNewAnnouncement({ title: '', content: '', priority: 'normal', expiresAt: '' });
    } catch (error) {
      console.error('Failed to save announcement:', error);
      showToast('Failed to save announcement', 'error');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      expiresAt: announcement.expiresAt
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter(announcement => announcement.id !== id));
      showToast('Announcement deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      showToast('Failed to delete announcement', 'error');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-800 border-error-200';
      case 'normal':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Stay updated with society news and important notices</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Announcements List */}
      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{announcement.content}</p>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-1 text-gray-400 hover:text-error-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{announcement.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {announcement.createdAt}</span>
                </div>
                {announcement.expiresAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Expires: {announcement.expiresAt}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* New/Edit Announcement Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAnnouncement(null);
          setNewAnnouncement({ title: '', content: '', priority: 'normal', expiresAt: '' });
        }}
        title={editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
        size="lg"
      >
        <form onSubmit={handleSubmitAnnouncement} className="space-y-4">
          <Input
            label="Title"
            placeholder="Announcement title"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows="4"
              placeholder="Announcement content..."
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                required
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={newAnnouncement.expiresAt}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, expiresAt: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingAnnouncement(null);
                setNewAnnouncement({ title: '', content: '', priority: 'normal', expiresAt: '' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements; 