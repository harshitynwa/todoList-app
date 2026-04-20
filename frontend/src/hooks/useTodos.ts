import { useCallback, useState } from 'react';
import API from '../services/api';
import type { Todo } from '../types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await API.get<Todo[]>('/todos');
      setTodos(data);
    } catch {
      setError('Unable to load todo lists.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    setTodos,
  };
}
