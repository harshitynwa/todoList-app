import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiPlus, FiRefreshCw } from 'react-icons/fi';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import API from '../services/api';
import type { Task, Todo } from '../types';

interface TaskPageProps {
  todoId: string;
}

export default function TaskPage({ todoId }: TaskPageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const fetchPageData = useCallback(async () => {
    if (!todoId) {
      setError('Todo id is required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [todosResp, tasksResp] = await Promise.all([
        API.get<Todo[]>('/todos'),
        API.get<Task[]>(`/todos/${todoId}/tasks`),
      ]);

      const foundTodo = todosResp.find((item) => item.id === todoId);
      if (!foundTodo) {
        setError('Todo not found.');
        setTodo(null);
        setTasks([]);
        return;
      }

      setTodo(foundTodo);
      setTasks(tasksResp);
    } catch {
      setError('Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [todoId]);

  useEffect(() => {
    void fetchPageData();
  }, [fetchPageData]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        setIsCreateOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const completion = useMemo(
    () => ({
      done: tasks.filter((task) => task.isCompleted).length,
      total: tasks.length,
    }),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    if (filter === 'PENDING') {
      return tasks.filter((task) => !task.isCompleted);
    }
    if (filter === 'COMPLETED') {
      return tasks.filter((task) => task.isCompleted);
    }
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="app-shell">
      <div className="board-card">
        <header className="board-header">
          <div>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              <FiArrowLeft /> Back to todos
            </button>
            <h1 className="board-title">{todo ? todo.name : 'Todo Tasks'}</h1>
            <p className="board-subtitle">
              {completion.done}/{completion.total} tasks complete
            </p>
          </div>
          <div className="board-actions">
            <button type="button" className="btn btn-secondary" onClick={() => void fetchPageData()}>
              <FiRefreshCw /> Refresh
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setIsCreateOpen((prev) => !prev)}>
              <FiPlus /> {isCreateOpen ? 'Close' : 'Add Task'}
            </button>
          </div>
        </header>

        {/* {error && <div className="error-banner">{error}</div>} */}

        <div className={`expandable ${isCreateOpen ? 'open' : ''}`}>
          {todo && <TaskForm todoId={todoId} onSuccess={fetchPageData} onCancel={() => setIsCreateOpen(false)} />}
        </div>

        <section className="section-card">
          <div className="section-card__header">
            <h2 className="section-title">Tasks</h2>
            <div className="filter-tabs">
              <button
                type="button"
                className={`tab-button ${filter === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilter('ALL')}
              >
                All ({tasks.length})
              </button>
              <button
                type="button"
                className={`tab-button ${filter === 'PENDING' ? 'active' : ''}`}
                onClick={() => setFilter('PENDING')}
              >
                Pending ({tasks.filter((task) => !task.isCompleted).length})
              </button>
              <button
                type="button"
                className={`tab-button ${filter === 'COMPLETED' ? 'active' : ''}`}
                onClick={() => setFilter('COMPLETED')}
              >
                Completed ({tasks.filter((task) => task.isCompleted).length})
              </button>
            </div>
          </div>
          <div className="task-list">
            {loading ? (
              <div className="empty-state">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">No tasks yet. Add one to get started.</div>
            ) : (
              filteredTasks.map((task) => <TaskItem key={task.id} task={task} onUpdate={fetchPageData} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
