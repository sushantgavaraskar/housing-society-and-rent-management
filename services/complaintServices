// services/complaintService.js
const Complaint = require('../models/Complaint');
const Flat = require('../models/Flat');

exports.createComplaint = async ({ raisedBy, userRole, flatId, category, subject, description }) => {
  const flat = await Flat.findById(flatId).populate('building society');
  if (!flat) throw new Error('Flat not found');

  const complaint = await Complaint.create({
    raisedBy,
    userRole,
    flat: flat._id,
    building: flat.building._id,
    society: flat.society._id,
    category,
    subject,
    description,
  });

  return complaint;
};

exports.getComplaintsByUser = async (userId, userRole) => {
  return await Complaint.find({ raisedBy: userId, userRole })
    .populate('flat')
    .populate('building')
    .populate('society');
};

// Updated getAllComplaints()
exports.getAllComplaints = async ({ page = 1, limit = 10, status, category }) => {
    const { skip } = require('../utils/pagination').paginate({ page, limit });
  
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
  
    const complaints = await Complaint.find(query)
      .skip(skip)
      .limit(limit)
      .populate('raisedBy', 'name email role')
      .populate('flat building society');
  
    const total = await Complaint.countDocuments(query);
  
    return { complaints, total };
  };
  

// services/complaintService.js (add this)
exports.updateComplaintStatus = async ({ complaintId, status, adminNote, resolvedBy }) => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new Error('Complaint not found');
  
    complaint.status = status;
    complaint.adminNote = adminNote || '';
    complaint.resolvedBy = resolvedBy;
    complaint.resolvedOn = new Date();
  
    await complaint.save();
    return complaint;
  };
  