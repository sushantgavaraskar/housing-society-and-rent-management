const Building = require('../models/Building');
const Society = require('../models/Society');

class BuildingService {
  // Create a new building
  static async createBuilding(buildingData) {
    const { societyId, name, totalFloors, totalFlats, addressLabel } = buildingData;

    // Verify society exists
    const society = await Society.findById(societyId);
    if (!society) {
      throw new Error('Society not found');
    }

    const building = await Building.create({
      name,
      totalFloors,
      totalFlats,
      addressLabel,
      society: societyId
    });

    // Update society's building count
    society.totalBuildings += 1;
    await society.save();

    return building;
  }

  // Get building by ID
  static async getBuildingById(buildingId) {
    const building = await Building.findById(buildingId)
      .populate('society', 'name');
    
    if (!building) {
      throw new Error('Building not found');
    }

    return building;
  }

  // Update a building
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

  // Delete a building
  static async deleteBuilding(buildingId) {
    const building = await Building.findByIdAndDelete(buildingId);
    
    if (!building) {
      throw new Error('Building not found');
    }

    // Update society's building count
    const society = await Society.findById(building.society);
    if (society) {
      society.totalBuildings = Math.max(0, society.totalBuildings - 1);
      await society.save();
    }

    return building;
  }

  // Get buildings by society
  static async getBuildingsBySociety(societyId, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;

    const [buildings, total] = await Promise.all([
      Building.find({ society: societyId })
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

  // Get all buildings with pagination
  static async getAllBuildings(pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;

    const [buildings, total] = await Promise.all([
      Building.find()
        .populate('society', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Building.countDocuments()
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