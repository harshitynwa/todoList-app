import { useMemo, useState } from 'react';
import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../services/api.ts';
import type { Task } from '../types';

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
}

export default function TaskItem({
  task,
  onUpdate,
}: {
  task: Task;
  onUpdate: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: task.name,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSave = useMemo(
    () => form.name.trim() && form.description.trim() && form.dueDate && form.priority,
    [form],
  );

  const saveTask = async () => {
    setError('');
    if (!canSave) {
      const msg = 'All fields are required.';
      setError(msg);
      toast.error(msg, { position: 'top-right' });
      return;
    }

    try {
      setLoading(true);
      await API.put(`/tasks/${task.id}`, {
        name: form.name.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate,
        priority: form.priority,
      });
      setEditing(false);
      toast.success('Task updated successfully!', { position: 'top-right' });
      onUpdate();
    } catch (err) {
      const apiError = err as ApiError;
      const errorMsg = apiError?.response?.data?.error || apiError?.response?.data?.message || 'Unable to save task.';
      setError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async () => {
    try {
      await API.put(`/tasks/${task.id}`, {
        isCompleted: !task.isCompleted,
      });
      const msg = task.isCompleted ? 'Task marked as pending.' : 'Task marked as complete!';
      toast.success(msg, { position: 'top-right' });
      onUpdate();
    } catch (err) {
      const apiError = err as ApiError;
      const errorMsg = apiError?.response?.data?.error || apiError?.response?.data?.message || 'Unable to update task.';
      setError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
    }
  };

  const deleteTask = async () => {
    try {
      await API.delete(`/tasks/${task.id}`);
      toast.success('Task deleted successfully!', { position: 'top-right' });
      onUpdate();
    } catch (err) {
      const apiError = err as ApiError;
      const errorMsg = apiError?.response?.data?.error || apiError?.response?.data?.message || 'Unable to delete task.';
      setError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
    }
  };

  return (
    <div className="task-card">
      {editing ? (
        <div className="task-edit-form">
          <div>
            <label className="field-label">Title</label>
            <input
              className="input-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea
              className="input-control"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="task-edit-row">
            <input
              type="date"
              className="input-control"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <select
              className="input-control"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* {error && <div className="error-banner">{error}</div>} */}

          <div className="task-edit-actions">
            <button className="btn btn-primary" onClick={saveTask} disabled={!canSave || loading}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}>
              <FiX /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={task.isCompleted ? 'is-complete' : ''}>
          <div className="task-card__row">
            <div>
              <h2 className={`task-card__title ${task.isCompleted ? 'is-complete' : ''}`}>{task.name}</h2>
              <div className="task-card__description">{task.description}</div>
              <div className="task-card__meta task-meta-row">
                <span className="task-pill">Due {new Date(task.dueDate).toLocaleDateString('en-US')}</span>
                <span className={`task-pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                <span className={`task-pill ${task.isCompleted ? 'status-complete' : 'status-pending'}`}>
                  {task.isCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
            <div className="task-card__actions task-actions-row">
              <button
                className="task-checkbox"
                onClick={toggleComplete}
                aria-label={task.isCompleted ? 'Mark as pending' : 'Mark as complete'}
                title={task.isCompleted ? 'Mark as pending' : 'Mark as complete'}
              >
                <span className={`task-checkbox__dot ${!task.isCompleted ? 'checked' : ''}`} />
                {task.isCompleted ? 'Mark pending' : 'Mark completed'}
              </button>
              {!task.isCompleted && (
                <button
                  className="icon-button"
                  onClick={() => setEditing(true)}
                  aria-label="Edit task"
                  title="Edit task"
                >
                  <FiEdit2 />
                </button>
              )}
              <button
                className="icon-button danger"
                onClick={deleteTask}
                aria-label="Delete task"
                title="Delete task"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>

          {/* {error && <div className="error-banner mt-12">{error}</div>} */}
        </div>
      )}
    </div>
  );
}
