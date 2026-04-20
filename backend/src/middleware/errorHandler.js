import { sendError } from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';

export function notFoundHandler(req, res, next) {
  next(new AppError('Route not found', 404));
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Unexpected server error';
  return sendError(res, message, statusCode);
}
