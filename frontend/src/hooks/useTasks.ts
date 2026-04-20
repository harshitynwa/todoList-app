import { useCallback, useState } from 'react';
import API from '../services/api';
import type { Task } from '../types';

export function useTasks(todoId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!todoId) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await API.get<Task[]>(`/todos/${todoId}/tasks`);
      setTasks(data);
    } catch {
      setError('Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [todoId]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    setTasks,
  };
}
