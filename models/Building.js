// models/Building.js

const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Building name is required'],
    trim: true,
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: [true, 'Society reference is required'],
  },
  totalFloors: {
    type: Number,
    required: [true, 'Total number of floors is required'],
    min: [1, 'There must be at least 1 floor'],
  },
  totalFlats: {
    type: Number,
    required: [true, 'Total number of flats is required'],
    min: [1, 'There must be at least 1 flat'],
  },
  addressLabel: {
    type: String,
    trim: true,
    default: '',
    // Optional label if address differs from society (e.g., "Wing B, Gate 2")
  },
}, {
  timestamps: true,
});

// Pre-save hook to automatically create flats when building is created
buildingSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Flat = mongoose.model('Flat');
      
      // Check if flats already exist for this building
      const existingFlats = await Flat.countDocuments({ building: this._id });
      if (existingFlats > 0) {
        return next(); // Flats already exist, skip creation
      }

      const flats = [];
      const flatsPerFloor = Math.ceil(this.totalFlats / this.totalFloors);

      for (let floor = 1; floor <= this.totalFloors; floor++) {
        const flatsOnThisFloor = Math.min(flatsPerFloor, this.totalFlats - flats.length);
        
        for (let flatNum = 1; flatNum <= flatsOnThisFloor; flatNum++) {
          const flatNumber = `${floor}${String(flatNum).padStart(2, '0')}`;
          
          flats.push({
            flatNumber,
            floor,
            building: this._id,
            society: this.society,
            occupancyStatus: 'vacant'
          });
        }
      }

      if (flats.length > 0) {
        await Flat.insertMany(flats);
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Building', buildingSchema);
