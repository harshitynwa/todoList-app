import { FiPlus, FiX } from 'react-icons/fi';

interface AddTodoCardProps {
  isOpen: boolean;
  name: string;
  onToggle: () => void;
  onNameChange: (value: string) => void;
  onCreate: () => void;
  onCancel: () => void;
}

export default function AddTodoCard({
  isOpen,
  name,
  onToggle,
  onNameChange,
  onCreate,
  onCancel,
}: AddTodoCardProps) {
  if (!isOpen) {
    return (
      <button type="button" className="add-todo-card" onClick={onToggle}>
        <FiPlus />
        <span>Add List</span>
      </button>
    );
  }

  return (
    <div className="todo-card todo-card--add">
      <label className="field-label" htmlFor="todo-name-input">
        List name
      </label>
      <input
        id="todo-name-input"
        className="input-control"
        placeholder="e.g. Groceries"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <div className="panel-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <FiX /> Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={onCreate} disabled={!name.trim()}>
          <FiPlus /> Create
        </button>
      </div>
    </div>
  );
}
