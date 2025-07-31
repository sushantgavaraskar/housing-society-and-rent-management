// services/flatService.js
const Flat = require('../models/Flat');
const User = require('../models/User');
const Building = require('../models/Building');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors');

class FlatService {
  // Create flats for a building
  static async createFlatsForBuilding(buildingId, totalFlats, adminId) {
    // Validate input parameters
    if (!buildingId || !totalFlats || totalFlats <= 0) {
      throw new Error('Invalid parameters: buildingId and totalFlats (positive number) are required');
    }

    const building = await Building.findById(buildingId);
    if (!building) {
      throw new Error('Building not found');
    }

    // Check if flats already exist for this building
    const existingFlats = await Flat.countDocuments({ building: buildingId });
    if (existingFlats > 0) {
      throw new Error('Flats already exist for this building');
    }

    const flats = [];
    const flatsPerFloor = Math.ceil(totalFlats / building.totalFloors);

    for (let floor = 1; floor <= building.totalFloors; floor++) {
      const flatsOnThisFloor = Math.min(flatsPerFloor, totalFlats - flats.length);
      
      for (let flatNum = 1; flatNum <= flatsOnThisFloor; flatNum++) {
        const flatNumber = `${floor}${String(flatNum).padStart(2, '0')}`;
        
        flats.push({
          flatNumber,
          floor,
          building: buildingId,
          society: building.society,
          owner: adminId, // Default owner is the admin who created it
          occupancyStatus: 'vacant'
        });
      }
    }

    const createdFlats = await Flat.insertMany(flats);

    // ✅ FIXED: Update admin's society if not set
    const admin = await User.findById(adminId);
    if (admin && !admin.society) {
      admin.society = building.society;
      await admin.save();
    }

    return createdFlats;
  }

  static async assignOwnerToFlat(flatId, ownerId) {
    if (!flatId || !ownerId) {
      throw new BadRequestError('Flat ID and Owner ID are required');
    }

    const flat = await Flat.findById(flatId);
    if (!flat) {
      throw new NotFoundError('Flat not found');
    }

    const owner = await User.findById(ownerId);
    if (!owner) {
      throw new NotFoundError('Owner not found');
    }

    // ✅ FIXED: Check if owner is already assigned to another flat
    const existingOwnerFlat = await Flat.findOne({ owner: ownerId });
    if (existingOwnerFlat) {
      throw new ConflictError('User is already assigned as owner to another flat');
    }

    flat.owner = ownerId;
    await flat.save();
    return flat;
  }

  // Remove owner from flat
  static async removeOwnerFromFlat(flatId) {
    if (!flatId) {
      throw new Error('Flat ID is required');
    }

    const flat = await Flat.findById(flatId);
    if (!flat) {
      throw new Error('Flat not found');
    }

    flat.owner = null;
    await flat.save();

    return flat;
  }

  static async assignTenantToFlat(flatId, tenantId) {
    if (!flatId || !tenantId) {
      throw new BadRequestError('Flat ID and Tenant ID are required');
    }

    const flat = await Flat.findById(flatId);
    if (!flat) {
      throw new NotFoundError('Flat not found');
    }

    const tenant = await User.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    // ✅ FIXED: Check if tenant is already assigned to another flat
    const existingTenantFlat = await Flat.findOne({ tenant: tenantId });
    if (existingTenantFlat) {
      throw new ConflictError('User is already assigned as tenant to another flat');
    }

    flat.tenant = tenantId;
    await flat.save();
    return flat;
  }

  // Remove tenant from flat
  static async removeTenantFromFlat(flatId, ownerId) {
    if (!flatId || !ownerId) {
      throw new Error('Flat ID and Owner ID are required');
    }

    const flat = await Flat.findOne({ _id: flatId, owner: ownerId });
    if (!flat) {
      throw new Error('Unauthorized or flat not found');
    }

    flat.tenant = null;
    flat.isRented = false;
    flat.occupancyStatus = 'vacant';
    await flat.save();

    return flat;
  }

  // Get flats by owner
  static async getFlatsByOwner(ownerId) {
    if (!ownerId) {
      throw new Error('Owner ID is required');
    }

    const flats = await Flat.find({ owner: ownerId })
      .populate('building', 'name')
      .populate('society', 'name')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 });

    return flats;
  }

  // Get flat by ID with full details
  static async getFlatById(flatId) {
    if (!flatId) {
      throw new Error('Flat ID is required');
    }

    const flat = await Flat.findById(flatId)
      .populate('owner', 'name email phone')
      .populate('tenant', 'name email phone')
      .populate('building', 'name')
      .populate('society', 'name');

    if (!flat) {
      throw new Error('Flat not found');
    }

    return flat;
  }

  // Get flats by building
  static async getFlatsByBuilding(buildingId, pagination = {}) {
    if (!buildingId) {
      throw new Error('Building ID is required');
    }

    const { page = 1, limit = 10, skip = 0 } = pagination;

    const [flats, total] = await Promise.all([
      Flat.find({ building: buildingId })
        .populate('owner', 'name email')
        .populate('tenant', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ flatNumber: 1 }),
      Flat.countDocuments({ building: buildingId })
    ]);

    return {
      flats,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  // Get user's assigned flat
  static async getUserFlat(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const flat = await Flat.findOne({
      $or: [
        { owner: userId },
        { tenant: userId }
      ]
    })
    .populate('building', 'name')
    .populate('society', 'name')
    .populate('owner', 'name email phone')
    .populate('tenant', 'name email phone');

    if (!flat) {
      throw new Error('No flat assigned to user');
    }

    return flat;
  }
}

module.exports = FlatService;
