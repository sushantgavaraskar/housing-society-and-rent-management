const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: null,
      errors: errors.array(),
      statusCode: 400
    });
  }
  next();
};
module.exports =  validate ;