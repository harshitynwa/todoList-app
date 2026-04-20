import { useEffect, useState } from 'react';
import TodoPage from './pages/TodoPage';
import TaskPage from './pages/TaskPage';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (path === '/') {
    return <TodoPage />;
  }

  if (path.startsWith('/todos/')) {
    const todoId = path.replace('/todos/', '');
    return <TaskPage todoId={todoId} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="rounded-2xl bg-white p-6 text-slate-700 shadow">
        Page not found.
      </div>
    </div>
  );
}