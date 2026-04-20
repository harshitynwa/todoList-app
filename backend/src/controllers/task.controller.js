import {
  createTask as createTaskInStore,
  deleteTask as deleteTaskFromStore,
  findTaskById,
  findTodoById,
  getTasksByTodoId,
  hasTaskName,
  updateTask as updateTaskInStore,
} from '../store/dataStore.js';
import {
  isBoolean,
  isNonEmptyText,
  isValidDueDate,
  isValidPriority,
  normalizeText,
} from '../helpers/validation.js';
import AppError from '../utils/AppError.js';
import { sendSuccess } from '../utils/apiResponse.js';

export function getTasksByTodo(req, res, next) {
  try {
  const { id } = req.params;
  if (!findTodoById(id)) {
    return next(new AppError(`Todo list not found for id "${id}".`, 404));
  }

  const tasks = getTasksByTodoId(id);
  return sendSuccess(res, tasks);
  } catch (error) {
    return next(error);
  }
}

export function createTask(req, res, next) {
  try {
  const { id } = req.params;
  if (!findTodoById(id)) {
    return next(new AppError(`Cannot create task because todo list "${id}" does not exist.`, 404));
  }

  const { name, description, dueDate, priority, isCompleted } = req.body;
  if (hasTaskName(id, name)) {
    return next(
      new AppError(
        `A task named "${name}" already exists in this todo list. Please use a unique task name.`,
        400,
      ),
    );
  }

  const task = createTaskInStore(id, {
    name,
    description,
    dueDate,
    priority,
    isCompleted,
  });
  return sendSuccess(res, task, 201);
  } catch (error) {
    return next(error);
  }
}

export function updateTask(req, res, next) {
  try {
  const { taskId } = req.params;
  const task = findTaskById(taskId);
  if (!task) {
    return next(new AppError(`Task not found for id "${taskId}".`, 404));
  }

  const incoming = req.body;
  const incomingFields = Object.keys(incoming);
  if (incomingFields.length === 0) {
    return next(new AppError('At least one field is required to update', 400));
  }

  if (task.isCompleted) {
    // Locked tasks can only be toggled back to incomplete.
    const editingOtherFields = incomingFields.some((field) => field !== 'isCompleted');
    if (editingOtherFields) {
      return next(new AppError('Completed tasks cannot be edited', 400));
    }
  }

  const updates = {};

  if (incoming.name !== undefined) {
    const name = normalizeText(incoming.name);
    if (!isNonEmptyText(name)) {
      return next(new AppError('Task name is required', 400));
    }

    if (hasTaskName(task.todoId, name, task.id)) {
      return next(
        new AppError(
          `A task named "${name}" already exists in this todo list. Please use a unique task name.`,
          400,
        ),
      );
    }

    updates.name = name;
  }

  if (incoming.description !== undefined) {
    const description = normalizeText(incoming.description);
    if (!isNonEmptyText(description)) {
      return next(new AppError('Description is required', 400));
    }

    updates.description = description;
  }

  if (incoming.dueDate !== undefined) {
    const dueDate = normalizeText(incoming.dueDate);
    if (!isValidDueDate(dueDate)) {
      return next(new AppError('Due date must be a valid date', 400));
    }

    updates.dueDate = dueDate;
  }

  if (incoming.priority !== undefined) {
    if (!isValidPriority(incoming.priority)) {
      return next(new AppError('Invalid priority', 400));
    }

    updates.priority = incoming.priority;
  }

  if (incoming.isCompleted !== undefined) {
    if (!isBoolean(incoming.isCompleted)) {
      return next(new AppError('isCompleted must be a boolean', 400));
    }
    updates.isCompleted = incoming.isCompleted;
  }

  const updatedTask = updateTaskInStore(taskId, updates);
  return sendSuccess(res, updatedTask);
  } catch (error) {
    return next(error);
  }
}

export function deleteTask(req, res, next) {
  try {
  const { taskId } = req.params;
  const deletedTask = deleteTaskFromStore(taskId);
  if (!deletedTask) {
    return next(new AppError(`Task not found for id "${taskId}".`, 404));
  }

  return sendSuccess(res, null);
  } catch (error) {
    return next(error);
  }
}
