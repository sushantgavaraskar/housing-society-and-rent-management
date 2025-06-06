const Society = require('../models/Society');

exports.createSociety = async (req, res) => {
    try {
        const { name, address } = req.body;

        const society = await Society.create({
            name,
            address,
            admin: req.user._id
        });

        res.status(201).json(society);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMySocieties = async (req, res) => {
    try {
        const societies = await Society.find({ admin: req.user._id });
        res.json(societies);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
