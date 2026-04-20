import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../services/api';

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
}

export default function TaskForm({
  todoId,
  onSuccess,
  onCancel,
}: {
  todoId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid =
    form.name.trim() &&
    form.description.trim() &&
    form.dueDate &&
    form.priority;

  const handleSubmit = async () => {
    setError('');

    if (!isValid) {
      const msg = 'All fields are required.';
      setError(msg);
      toast.error(msg, { position: 'top-right' });
      return;
    }

    try {
      setLoading(true);
      await API.post(`/todos/${todoId}/tasks`, {
        name: form.name.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate,
        priority: form.priority,
      });
      setForm({ name: '', description: '', dueDate: '', priority: 'MEDIUM' });
      toast.success('Task created successfully!', { position: 'top-right' });
      onSuccess();
    } catch (err) {
      const apiError = err as ApiError;
      const errorMsg = apiError?.response?.data?.error || apiError?.response?.data?.message || 'Unable to create task.';
      setError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-card">
      <div className="panel-card__header">
        <h2 className="panel-card__title">Create Task</h2>
      </div>
      <div className="panel-form">
        <input
          className="input-control"
          placeholder="Task title"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          rows={3}
          className="input-control"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="form-row">
          <input
            type="date"
            className="input-control"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <select
            className="input-control"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* {error && (
          <div className="error-banner">{error}</div>
        )} */}

        <div className="panel-actions">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} title="Cancel task creation">
              <FiX /> Cancel
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isValid || loading}
            title="Create task"
          >
            <FiPlus /> {loading ? 'Saving...' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
