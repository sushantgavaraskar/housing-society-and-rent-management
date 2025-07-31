// services/buildingService.js
const Building = require('../models/Building');
const Flat = require('../models/Flat');
const Society = require('../models/Society');

class BuildingService {
  // Create building with automatic flat creation
  static async createBuilding(buildingData) {
    const session = await Building.startSession();
    session.startTransaction();

    try {
      // Validate society exists
      const society = await Society.findById(buildingData.society);
      if (!society) {
        throw new Error('Society not found');
      }

      // Create building
      const building = new Building({
        name: buildingData.name,
        society: buildingData.society,
        totalFloors: buildingData.totalFloors,
        totalFlats: buildingData.totalFlats,
        addressLabel: buildingData.addressLabel || ''
      });

      await building.save({ session });

      // Create flats for the building
      const flats = [];
      const flatsPerFloor = Math.ceil(building.totalFlats / building.totalFloors);

      for (let floor = 1; floor <= building.totalFloors; floor++) {
        const flatsOnThisFloor = Math.min(flatsPerFloor, building.totalFlats - flats.length);
        
        for (let flatNum = 1; flatNum <= flatsOnThisFloor; flatNum++) {
          const flatNumber = `${floor}${String(flatNum).padStart(2, '0')}`;
          
          flats.push({
            flatNumber,
            floor,
            building: building._id,
            society: building.society,
            occupancyStatus: 'vacant'
          });
        }
      }

      if (flats.length > 0) {
        await Flat.insertMany(flats, { session });
      }

      await session.commitTransaction();
      session.endSession();

      return building;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // Update building
  static async updateBuilding(buildingId, updateData) {
    const building = await Building.findByIdAndUpdate(
      buildingId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!building) {
      throw new Error('Building not found');
    }

    return building;
  }

  // Delete building and its flats
  static async deleteBuilding(buildingId) {
    const session = await Building.startSession();
    session.startTransaction();

    try {
      // Delete all flats in the building
      await Flat.deleteMany({ building: buildingId }, { session });

      // Delete the building
      const building = await Building.findByIdAndDelete(buildingId, { session });

      if (!building) {
        throw new Error('Building not found');
      }

      await session.commitTransaction();
      session.endSession();

      return building;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // Get building by ID with populated society
  static async getBuildingById(buildingId) {
    const building = await Building.findById(buildingId)
      .populate('society', 'name address');

    if (!building) {
      throw new Error('Building not found');
    }

    return building;
  }

  // Get buildings by society
  static async getBuildingsBySociety(societyId, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;

    const [buildings, total] = await Promise.all([
      Building.find({ society: societyId })
        .populate('society', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Building.countDocuments({ society: societyId })
    ]);

    return {
      buildings,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }
}

module.exports = BuildingService; 