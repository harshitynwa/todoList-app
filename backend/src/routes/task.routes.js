import express from 'express';
import { deleteTask, updateTask } from '../controllers/task.controller.js';

const router = express.Router();

router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
