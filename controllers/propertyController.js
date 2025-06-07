const Property = require('../models/property');

exports.createProperty = async (req, res, next) => {
  try {
    const property = new Property({ ...req.body, owner: req.user._id });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
};

exports.assignTenant = async (req, res, next) => {
  try {
    const { tenantId } = req.body;
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { tenant: tenantId },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found or not owned by you' });
    res.json(property);
  } catch (err) {
    next(err);
  }
};

exports.getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate('society')
      .populate('tenant', 'name email');
    res.json(properties);
  } catch (err) {
    next(err);
  }
};
