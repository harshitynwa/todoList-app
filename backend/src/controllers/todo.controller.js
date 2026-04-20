import {
  createTodo as createTodoInStore,
  deleteTodo as deleteTodoFromStore,
  getTasks,
  getTodos as getTodosFromStore,
  hasTodoName,
} from '../store/dataStore.js';
import AppError from '../utils/AppError.js';
import { sendSuccess } from '../utils/apiResponse.js';

function mapTodoWithCounts(todo, tasks) {
  const todoTasks = tasks.filter((task) => task.todoId === todo.id);
  const completedCount = todoTasks.filter((task) => task.isCompleted).length;
  const totalCount = todoTasks.length;
  const pendingCount = todoTasks.filter((task) => !task.isCompleted).length;
  const isCompleted = todoTasks.length > 0 && todoTasks.every((task) => task.isCompleted);

  return {
    ...todo,
    completedCount,
    totalCount,
    pendingCount,
    isCompleted,
  };
}

export function getTodos(req, res, next) {
  try {
    const todos = getTodosFromStore();
    const tasks = getTasks();

    const response = todos.map((todo) => mapTodoWithCounts(todo, tasks));

    return sendSuccess(res, response);
  } catch (error) {
    return next(error);
  }
}

export function createTodo(req, res, next) {
  try {
    const { name } = req.body;

    if (hasTodoName(name)) {
      return next(
        new AppError(`A todo list named "${name}" already exists. Please choose a different name.`, 400),
      );
    }

    const todo = createTodoInStore(name);
    const todoWithCounts = mapTodoWithCounts(todo, getTasks());
    return sendSuccess(res, todoWithCounts, 201);
  } catch (error) {
    return next(error);
  }
}

export function deleteTodo(req, res, next) {
  try {
    const { id } = req.params;
    const deletedTodo = deleteTodoFromStore(id);
    if (!deletedTodo) {
      return next(new AppError(`Todo list not found for id "${id}".`, 404));
    }

    return sendSuccess(res, null);
  } catch (error) {
    return next(error);
  }
}
