const Society = require('../models/society');

exports.createSociety = async (req, res, next) => {
  try {
    const society = new Society(req.body);
    await society.save();
    res.status(201).json(society);
  } catch (err) {
    next(err);
  }
};
