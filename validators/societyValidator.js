exports.societyCreateValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('registrationNumber').notEmpty().withMessage('Registration number is required'),
    body('address.street').notEmpty().withMessage('Street is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.pincode').notEmpty().withMessage('Pincode is required'),
    body('maintenancePolicy.frequency').notEmpty().withMessage('Maintenance frequency is required'),
    body('maintenancePolicy.amountPerFlat').isNumeric().withMessage('Maintenance amount must be a number'),
  ];