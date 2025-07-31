const Maintenance = require('../models/Maintenance');
const Flat = require('../models/Flat');
const Society = require('../models/Society');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors');

class MaintenanceService {
  static async generateMaintenanceForMonth(societyId, billingMonth, adminId) {
    // Validate society exists
    const society = await Society.findById(societyId);
    if (!society) {
      throw new NotFoundError('Society not found');
    }

    // Check for existing maintenance records for this month
    const existing = await Maintenance.findOne({ 
      society: societyId, 
      billingMonth 
    });
    
    if (existing) {
      throw new ConflictError('Maintenance already generated for this month');
    }

    // Find all flats with owners in this society
    const flats = await Flat.find({ 
      society: societyId, 
      owner: { $ne: null } 
    });
    
    if (flats.length === 0) {
      throw new BadRequestError('No owned flats found in this society to generate maintenance for');
    }

    // Create maintenance records for each flat
    const records = flats.map(flat => ({
      flat: flat._id,
      building: flat.building,
      society: flat.society,
      billingMonth,
      amount: society.maintenancePolicy.amountPerFlat,
      generatedBy: adminId,
      status: 'unpaid',
      dueDate: new Date(new Date(billingMonth).getFullYear(), new Date(billingMonth).getMonth() + 1, 0), // Last day of billing month
    }));

    return await Maintenance.insertMany(records);
  }

  static async getMaintenanceStatus(societyId, billingMonth) {
    const maintenance = await Maintenance.find({ 
      society: societyId, 
      billingMonth 
    }).populate('flat building');
    
    return maintenance;
  }
}

module.exports = MaintenanceService; 