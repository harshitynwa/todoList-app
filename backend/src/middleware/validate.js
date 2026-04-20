import {
  isBoolean,
  isNonEmptyText,
  isValidDueDate,
  isValidPriority,
  normalizeText,
} from '../helpers/validation.js';
import AppError from '../utils/AppError.js';

export function validateTodoName(req, res, next) {
  const { name } = req.body || {};
  if (!isNonEmptyText(name)) {
    return next(new AppError('Todo name is required', 400));
  }

  req.body.name = normalizeText(name);
  return next();
}

export function validateTaskBody(req, res, next) {
  const { name, description, dueDate, priority, isCompleted } = req.body || {};

  if (!isNonEmptyText(name)) {
    return next(new AppError('Task name is required', 400));
  }

  if (!isNonEmptyText(description)) {
    return next(new AppError('Description is required', 400));
  }

  if (!isValidDueDate(dueDate)) {
    return next(new AppError('Due date must be a valid date', 400));
  }

  if (!isValidPriority(priority)) {
    return next(new AppError('Priority must be HIGH, MEDIUM, or LOW', 400));
  }

  if (isCompleted !== undefined && !isBoolean(isCompleted)) {
    return next(new AppError('isCompleted must be a boolean', 400));
  }

  req.body.name = normalizeText(name);
  req.body.description = normalizeText(description);
  req.body.dueDate = normalizeText(dueDate);
  req.body.priority = priority;
  req.body.isCompleted = Boolean(isCompleted);

  return next();
}
