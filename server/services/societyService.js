const Society = require('../models/Society');
const Building = require('../models/Building');
const Flat = require('../models/Flat');

class SocietyService {
  // Create a new society
  static async createSociety(societyData, adminId) {
    const { name, registrationNumber, address, maintenancePolicy } = societyData;

    // Check for existing society with same registration number
    const existing = await Society.findOne({ registrationNumber });
    if (existing) {
      throw new Error('Society with this registration number already exists');
    }
    
    // Parse address string if it's a string
    let addressObj = address;
    if (typeof address === 'string') {
      const addressParts = address.split(',').map(part => part.trim());
      addressObj = {
        street: addressParts[0] || '',
        city: addressParts[1] || '',
        state: addressParts[2] || '',
        pincode: addressParts[3] || ''
      };
    }
    
    // Parse maintenance policy if it's a string
    let maintenancePolicyObj = maintenancePolicy;
    if (typeof maintenancePolicy === 'string') {
      maintenancePolicyObj = {
        frequency: 'monthly',
        amountPerFlat: 1000
      };
    }

    const society = await Society.create({
      name,
      registrationNumber,
      address: addressObj,
      maintenancePolicy: maintenancePolicyObj,
      admin: adminId
    });
    
    return society;
  }

  // Get societies managed by an admin
  static async getSocietiesByAdmin(adminId, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;

    const [societies, total] = await Promise.all([
      Society.find({ admin: adminId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Society.countDocuments({ admin: adminId })
    ]);

    console.log('DEBUG societies:', societies);
    console.log('DEBUG total:', total);

    return {
      societies,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  // Update a society
  static async updateSociety(societyId, updateData, adminId) {
    console.log('DEBUG updateSociety query:', { _id: societyId, admin: adminId });
    console.log('DEBUG updateSociety updateData:', updateData);
    const society = await Society.findOneAndUpdate(
      { _id: societyId, admin: adminId },
      updateData,
      { new: true, runValidators: true }
    );
    console.log('DEBUG updateSociety result:', society);
    if (!society) {
      throw new Error('Society not found or you do not have permission to update it');
    }
    return society;
  }

  // Delete a society and all associated data
  static async deleteSociety(societyId, adminId) {
    const society = await Society.findOneAndDelete({ _id: societyId, admin: adminId });
    
    if (!society) {
      throw new Error('Society not found or you do not have permission to delete it');
    }

    // Delete associated buildings and flats
    await Building.deleteMany({ society: societyId });
    await Flat.deleteMany({ society: societyId });

    return society;
  }

  // Get society by ID
  static async getSocietyById(societyId) {
    const society = await Society.findById(societyId);
    if (!society) {
      throw new Error('Society not found');
    }
    return society;
  }

  // Add note to society
  static async addSocietyNote(societyId, note, adminId) {
    const society = await Society.findOneAndUpdate(
      { _id: societyId, admin: adminId },
      { adminNote: note },
      { new: true }
    );

    if (!society) {
      throw new Error('Society not found or you do not have permission to update it');
    }

    return society;
  }
}

module.exports = SocietyService;