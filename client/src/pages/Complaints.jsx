import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../utils/toast';
import { getMyComplaints, getAllComplaints, createComplaint } from '../services/complaintService';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let complaintsData;
      
      if (user?.role === 'admin') {
        complaintsData = await getAllComplaints();
      } else {
        complaintsData = await getMyComplaints();
      }
      
      setComplaints(complaintsData || []);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      showToast('Failed to fetch complaints', 'error');
      // Fallback to mock data if API fails
      setComplaints([
        {
          id: 1,
          title: 'Water Leakage in Kitchen',
          description: 'There is a water leakage from the ceiling in the kitchen area.',
          category: 'Plumbing',
          priority: 'high',
          status: 'pending',
          createdAt: '2024-01-15',
          user: 'John Doe'
        },
        {
          id: 2,
          title: 'Broken Elevator',
          description: 'The elevator is not working properly and making strange noises.',
          category: 'Electrical',
          priority: 'high',
          status: 'in-progress',
          createdAt: '2024-01-14',
          user: 'Jane Smith'
        },
        {
          id: 3,
          title: 'Garbage Collection Issue',
          description: 'Garbage is not being collected regularly from the building.',
          category: 'Maintenance',
          priority: 'medium',
          status: 'resolved',
          createdAt: '2024-01-13',
          user: 'Mike Johnson'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      const complaintData = await createComplaint(newComplaint);
      
      setComplaints([complaintData, ...complaints]);
      setShowModal(false);
      setNewComplaint({ title: '', description: '', category: '', priority: 'medium' });
      showToast('Complaint submitted successfully', 'success');
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      showToast('Failed to submit complaint', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning-500" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-primary-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'low':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-600">Manage and track complaints</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Complaint
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Complaints List */}
      <div className="grid gap-4">
        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{complaint.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Category: {complaint.category}</span>
                  <span>By: {complaint.user}</span>
                  <span>Date: {complaint.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(complaint.status)}
                <span className="text-sm font-medium capitalize">{complaint.status}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* New Complaint Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Submit New Complaint"
        size="lg"
      >
        <form onSubmit={handleSubmitComplaint} className="space-y-4">
          <Input
            label="Title"
            placeholder="Brief description of the issue"
            value={newComplaint.title}
            onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows="4"
              placeholder="Detailed description of the issue..."
              value={newComplaint.description}
              onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={newComplaint.category}
                onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Security">Security</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={newComplaint.priority}
                onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Submit Complaint
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Complaints; 