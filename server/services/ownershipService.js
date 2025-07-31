// services/ownershipService.js
const OwnershipRequest = require('../models/OwnershipRequest');
const Flat = require('../models/Flat');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // ✅ ADDED: Import sendEmail utility
const crypto = require('crypto');

// Generate a secure random password
const generateSecurePassword = () => {
  return crypto.randomBytes(8).toString('hex'); // 16 character hex string
};

exports.reviewOwnershipRequest = async ({ requestId, status, note, reviewerId }) => {
  const request = await OwnershipRequest.findById(requestId);
  if (!request) throw new Error('Ownership request not found');

  request.status = status;
  request.adminNote = note;
  request.reviewedBy = reviewerId;
  request.reviewedOn = new Date();
  await request.save();

  if (status === 'approved') {
    // Check if a user with the new owner's email already exists
    let newOwner = await User.findOne({ email: request.newOwnerEmail });
    
    if (!newOwner) {
      // ✅ FIXED: Generate secure random password instead of hardcoded one
      const securePassword = generateSecurePassword();
      
      // Get the flat to find its society
      const flat = await Flat.findById(request.flat);
      if (!flat) throw new Error('Flat not found');
      
      // Create a new user with the details from the request
      newOwner = await User.create({
        name: request.newOwnerName,
        email: request.newOwnerEmail,
        phone: request.newOwnerPhone,
        role: 'owner',
        society: flat.society,
        password: securePassword, // Secure random password
        // ✅ REMOVED: isActive: true - let schema handle default
      });

      // ✅ FIXED: Send email notification to new owner
      const subject = 'Your New Housing Society Account';
      const message = `Welcome! Your account has been created successfully.\n\nYour temporary password is: ${securePassword}\n\nPlease log in and change your password immediately for security.\n\nBest regards,\nHousing Society Management Team`;
      
      const emailResult = await sendEmail(newOwner.email, subject, message);
      if (!emailResult.success) {
        console.warn(`⚠️ Failed to send email to ${newOwner.email}: ${emailResult.error}`);
      } else {
        console.log(`✅ Email sent successfully to ${newOwner.email}`);
      }
    } else {
      // Update existing user's details if needed
      newOwner.name = request.newOwnerName;
      newOwner.phone = request.newOwnerPhone;
      newOwner.role = 'owner';
      await newOwner.save();
    }

    // Update the flat's owner to the new owner
    await Flat.findByIdAndUpdate(request.flat, { owner: newOwner._id });
  }

  return request;
};
