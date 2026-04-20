import { useEffect, useMemo, useState } from 'react';
import { FiLayout, FiList } from 'react-icons/fi';
import toast from 'react-hot-toast';
import TodoItem from '../components/TodoItem';
import AddTodoCard from '../components/AddTodoCard';
import { useTodos } from '../hooks/useTodos';
import API from '../services/api';

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
}

export default function TodoPage() {
  const { todos, loading, error, fetchTodos } = useTodos();
  const [name, setName] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        setIsCreateOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const completionStats = useMemo(() => {
    const completed = todos.filter((todo) => todo.isCompleted).length;
    return {
      total: todos.length,
      completed,
    };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return todos;
    }

    return todos.filter((todo) => todo.name.toLowerCase().includes(search));
  }, [todos, query]);

  const handleCreateTodo = async () => {
    setSubmitError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setSubmitError('Todo name is required.');
      return;
    }

    try {
      await API.post('/todos', { name: trimmed });
      setName('');
      setIsCreateOpen(false);
      toast.success('Todo created successfully!', { position: 'top-right' });
      void fetchTodos();
    } catch (apiError) {
      const err = apiError as ApiError;
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Unable to create todo.';
      setSubmitError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setSubmitError('');
    try {
      await API.delete(`/todos/${id}`);
      toast.success('Todo deleted successfully!', { position: 'top-right' });
      void fetchTodos();
    } catch (apiError) {
      const err = apiError as ApiError;
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Unable to delete todo.';
      setSubmitError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
    }
  };

  return (
    <div className="app-shell">
      <div className="board-card">
        <header className="board-header">
          <div>
            <h1 className="board-title">Workspace Todos</h1>
            <p className="board-subtitle">Track project buckets and drill into task execution.</p>
          </div>
          <div className="board-summary">
            <span>{completionStats.completed} completed</span>
            <span>{completionStats.total} total</span>
          </div>
        </header>

        <section className="section-card">
          <div className="section-card__header">
            <h2 className="section-title">Todo Lists</h2>
            <div className="board-actions">
              <button
                type="button"
                className={`icon-button ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
                aria-label="Grid view"
                title="Grid view"
              >
                <FiLayout />
              </button>
              <button
                type="button"
                className={`icon-button ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                aria-label="List view"
                title="List view"
              >
                <FiList />
              </button>
            </div>
          </div>

          <input
            className="input-control section-search"
            placeholder="Search lists by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search todo lists"
          />

          {/* {(error || submitError) && <div className="error-banner">{submitError || error}</div>} */}

          <div className={`todo-board ${view === 'list' ? 'todo-board--list' : ''}`}>
            <AddTodoCard
              isOpen={isCreateOpen}
              name={name}
              onToggle={() => setIsCreateOpen(true)}
              onNameChange={setName}
              onCreate={handleCreateTodo}
              onCancel={() => {
                setIsCreateOpen(false);
                setName('');
              }}
            />
            {loading ? (
              <div className="empty-state">Loading todo lists...</div>
            ) : filteredTodos.length === 0 ? (
              <div className="empty-state">No todo lists yet. Create your first one.</div>
            ) : (
              filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} onDelete={handleDeleteTodo} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
