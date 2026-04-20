import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { readJSON, writeJSON } from '../utils/fileStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TODOS_FILE_PATH = path.resolve(__dirname, '..', 'data', 'todos.json');
const TASKS_FILE_PATH = path.resolve(__dirname, '..', 'data', 'tasks.json');

const store = {
  todos: [],
  tasks: [],
};

function persistTodos() {
  writeJSON(TODOS_FILE_PATH, store.todos);
}

function persistTasks() {
  writeJSON(TASKS_FILE_PATH, store.tasks);
}

function recomputeTodoCompletion(todoId) {
  const todo = store.todos.find((item) => item.id === todoId);
  if (!todo) {
    return;
  }

  const todoTasks = store.tasks.filter((task) => task.todoId === todoId);
  todo.isCompleted = todoTasks.length > 0 && todoTasks.every((task) => task.isCompleted);
}

function syncAllTodoCompletion() {
  store.todos.forEach((todo) => recomputeTodoCompletion(todo.id));
}

export function initializeStore() {
  const todos = readJSON(TODOS_FILE_PATH);
  const tasks = readJSON(TASKS_FILE_PATH);

  store.todos = Array.isArray(todos) ? todos : [];
  store.tasks = Array.isArray(tasks) ? tasks : [];

  syncAllTodoCompletion();
  persistTodos();
}

export function getTodos() {
  return store.todos;
}

export function getTasks() {
  return store.tasks;
}

export function findTodoById(todoId) {
  return store.todos.find((todo) => todo.id === todoId) || null;
}

export function findTaskById(taskId) {
  return store.tasks.find((task) => task.id === taskId) || null;
}

export function getTasksByTodoId(todoId) {
  return store.tasks.filter((task) => task.todoId === todoId);
}

export function hasTodoName(name, excludeTodoId = null) {
  const normalized = name.toLowerCase();
  return store.todos.some(
    (todo) => todo.id !== excludeTodoId && todo.name.toLowerCase() === normalized,
  );
}

export function hasTaskName(todoId, name, excludeTaskId = null) {
  const normalized = name.toLowerCase();
  return store.tasks.some(
    (task) =>
      task.todoId === todoId &&
      task.id !== excludeTaskId &&
      task.name.toLowerCase() === normalized,
  );
}

export function createTodo(name) {
  const todo = {
    id: randomUUID(),
    name,
    isCompleted: false,
  };

  store.todos.push(todo);
  persistTodos();
  return todo;
}

export function deleteTodo(todoId) {
  const todoIndex = store.todos.findIndex((todo) => todo.id === todoId);
  if (todoIndex === -1) {
    return null;
  }

  const [deletedTodo] = store.todos.splice(todoIndex, 1);
  store.tasks = store.tasks.filter((task) => task.todoId !== todoId);

  persistTodos();
  persistTasks();
  return deletedTodo;
}

export function createTask(todoId, payload) {
  const task = {
    id: randomUUID(),
    todoId,
    name: payload.name,
    description: payload.description,
    dueDate: payload.dueDate,
    priority: payload.priority,
    isCompleted: Boolean(payload.isCompleted),
  };

  store.tasks.push(task);
  recomputeTodoCompletion(todoId);
  persistTasks();
  persistTodos();
  return task;
}

export function updateTask(taskId, updates) {
  const task = findTaskById(taskId);
  if (!task) {
    return null;
  }

  Object.assign(task, updates);
  recomputeTodoCompletion(task.todoId);
  persistTasks();
  persistTodos();
  return task;
}

export function deleteTask(taskId) {
  const taskIndex = store.tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return null;
  }

  const [deletedTask] = store.tasks.splice(taskIndex, 1);
  recomputeTodoCompletion(deletedTask.todoId);
  persistTasks();
  persistTodos();
  return deletedTask;
}
