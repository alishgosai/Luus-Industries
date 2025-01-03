export const errorHandler = (err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  };