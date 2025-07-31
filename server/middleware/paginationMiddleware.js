// middleware/paginationMiddleware.js

const paginationMiddleware = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Attach pagination data to request object
  req.pagination = {
    page,
    limit,
    skip
  };

  next();
};

module.exports = paginationMiddleware; 