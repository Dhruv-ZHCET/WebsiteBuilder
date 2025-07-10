import { Prisma } from '@prisma/client';

export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Duplicate entry',
          details: 'A record with this information already exists'
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found',
          details: 'The requested resource does not exist'
        });
      default:
        return res.status(400).json({
          error: 'Database error',
          details: error.message
        });
    }
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      details: 'Authentication failed'
    });
  }

  // Default error
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};