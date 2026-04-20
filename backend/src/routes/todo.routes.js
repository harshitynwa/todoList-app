import express from 'express';
import { createTodo, deleteTodo, getTodos } from '../controllers/todo.controller.js';
import { createTask, getTasksByTodo } from '../controllers/task.controller.js';
import { validateTodoName, validateTaskBody } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getTodos);
router.post('/', validateTodoName, createTodo);
router.delete('/:id', deleteTodo);

router.get('/:id/tasks', getTasksByTodo);
router.post('/:id/tasks', validateTaskBody, createTask);

export default router;
