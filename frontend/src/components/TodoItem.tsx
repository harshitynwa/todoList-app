import type { Todo } from '../types';
import { FiArrowRight, FiTrash2 } from 'react-icons/fi';
import ProgressBar from './ProgressBar';

export default function TodoItem({
  todo,
  onDelete,
}: {
  todo: Todo;
  onDelete: (id: string) => void;
}) {
  const openTodo = () => {
    window.history.pushState({}, '', `/todos/${todo.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="todo-card">
      <button type="button" className="todo-row__main" onClick={openTodo}>
        <span className={`todo-row__title ${todo.isCompleted ? 'is-complete' : ''}`}>{todo.name}</span>
        <span className="todo-row__meta">
          {todo.completedCount}/{todo.totalCount} completed
        </span>
        <ProgressBar
          value={todo.totalCount === 0 ? 0 : Math.round((todo.completedCount / todo.totalCount) * 100)}
        />
      </button>
      <div className="todo-row__actions">
        <button type="button" className="icon-button" onClick={openTodo} aria-label="Open todo" title="Open todo">
          <FiArrowRight />
        </button>
        <button
          type="button"
          className="icon-button danger"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          title="Delete todo"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}
