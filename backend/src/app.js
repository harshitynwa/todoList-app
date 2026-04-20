import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todo.routes.js';
import taskRoutes from './routes/task.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/todos', todoRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Todo API is running' });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
