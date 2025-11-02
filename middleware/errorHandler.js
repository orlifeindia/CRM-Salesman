// middleware/errorHandler.js

// 404 Handler
const notFound = (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.originalUrl 
  });
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

module.exports = { notFound, errorHandler };
