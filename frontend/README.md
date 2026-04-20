# TodoList App - Frontend

## Overview
This frontend is a React + TypeScript application built with **Vite**. It provides a clean UI for managing todo lists and tasks, including creation, filtering, and task detail pages.

## Tech Stack
- React 19
- TypeScript 6
- Vite
- Tailwind CSS
- Axios
- React Hot Toast
- React Icons
- ESLint

## Why React?
- React is great for building interactive UI components.
- It supports reusable component design and declarative rendering.
- It scales well when the app grows from simple pages to richer interfaces.

## Why TypeScript for Frontend?
- TypeScript catches type errors before runtime.
- It improves developer confidence when working with props, state, and API data.
- A React UI framework benefits from static typing for safer refactoring.

## Installation
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running Locally
- Start the development server:
  ```bash
  npm run dev
  ```
- Build the production output:
  ```bash
  npm run build
  ```
- Preview the production build:
  ```bash
  npm run preview
  ```

The app typically runs at `http://localhost:5173`.

## Code Structure
- `src/App.tsx` — simple route logic to show either the todo list or task page
- `src/pages/` — page-level components for `TodoPage` and `TaskPage`
- `src/components/` — reusable UI elements like todos, tasks, and forms
- `src/hooks/` — custom hooks for data fetching and state logic
- `src/services/api.ts` — Axios instance for backend communication with error handling
- `src/types/` — TypeScript interfaces used across the app
- `src/index.css` / `src/App.css` — styling and layout utilities (Tailwind CSS)

## Error Handling & User Feedback
The frontend implements a comprehensive error handling system:

### Toast Notifications
Users receive immediate feedback for all actions:
- **Success:** Green toast showing confirmation ("Todo created successfully!")
- **Error:** Red toast showing what went wrong
- All notifications appear at the top-right corner

### Inline Error Display
- Forms display error messages inline for context
- Errors persist until the user takes corrective action
- Error states are cleared when the form is reset

### API Response Handling
All errors from the backend are extracted and displayed with clear messages:
```
Attempting to create duplicate: "A todo list named 'Work' already exists. Please choose a different name."
Missing fields: "All fields are required."
Server error: "Unable to create todo."
```

## Performance Optimizations
- **CSS Bundling:** Tailwind CSS is compiled and bundled with the production build (7.52 KB)
- **No External CDN:** Removed render-blocking Tailwind CSS CDN dependency
- **Code Splitting:** Vite automatically handles code splitting for optimal loading
- **Tree Shaking:** Unused code is removed from production builds
- **Development:** Hot Module Replacement (HMR) enabled for instant feedback

**Build Output:**
- JavaScript: 261.52 KB (84.07 KB gzipped)
- CSS: 7.52 KB (2.31 KB gzipped)

## App Behavior
- `/` shows all todo lists with create/delete options 
- `/todos/:id` shows tasks for the selected todo list 
- The frontend talks to the backend API for todo and task CRUD operations
- Client-side navigation uses browser history without React Router
- Real-time UI updates after API operations with toast feedback
- Form validation prevents invalid submissions


### API Integration
All API calls go through `src/services/api.ts`:
```typescript
import API from '../services/api';

// GET request
const todos = await API.get<Todo[]>('/todos');

// POST request
await API.post('/todos', { name: 'New Todo' });

// PUT request
await API.put(`/tasks/${id}`, { isCompleted: true });

// DELETE request
await API.delete(`/todos/${id}`);
```

Errors are automatically extracted and can be displayed to users.

## Future Extension Ideas
- Add React Router for route-based pages and nested views.
- Introduce global state with Zustand or Redux.
- Add form validation with React Hook Form + Zod.
- Add user authentication and multi-user todo boards.
- Add tests with Vitest and React Testing Library.
- Add better analytics or a productivity dashboard.
- Add drag-and-drop to reorder tasks and todos.
- Add due date notifications and reminders.

## Running Full Stack Locally
1. Start the backend in one terminal:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the frontend in another terminal:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open `http://localhost:5173` in the browser.

## Why the Split?
- Backend is JavaScript for a quick, minimal API setup.
- Frontend is TypeScript because UI development benefits strongly from static typing.
- This split is a practical architecture for a modern full-stack project.
