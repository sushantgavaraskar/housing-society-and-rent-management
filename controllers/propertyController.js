const Property = require('../models/property');

exports.createProperty = async (req, res) => {
    try {
        const { title, description, address, rentAmount } = req.body;

        const property = await Property.create({
            title,
            description,
            address,
            rentAmount,
            owner: req.user._id
        });

        res.status(201).json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProperties = async (req, res) => {
    try {
        const { city, minRent, maxRent } = req.query;

        let query = {};

        if (city) {
            query.address = { $regex: city, $options: 'i' }; // case-insensitive
        }

        if (minRent || maxRent) {
            query.rentAmount = {};
            if (minRent) query.rentAmount.$gte = Number(minRent);
            if (maxRent) query.rentAmount.$lte = Number(maxRent);
        }

        const properties = await Property.find(query).populate('owner', 'name email');
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.rentProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const userId = req.user._id;

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (property.isRented) {
            return res.status(400).json({ message: 'Property already rented' });
        }

        property.isRented = true;
        property.tenant = userId;

        await property.save();

        res.status(200).json({ message: 'Property rented successfully', property });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMyProperties = async (req, res) => {
    try {
        const ownerId = req.user._id;

        const properties = await Property.find({ owner: ownerId }).populate('society').populate('tenant', 'name email');

        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
