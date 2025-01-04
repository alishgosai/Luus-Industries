export function errorHandler(err, req, res, next) {
    console.error(err.stack);
  
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message;
  
    res.status(statusCode).json({
      error: {
        message,
        status: statusCode,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  