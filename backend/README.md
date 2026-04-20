# TodoList App - Backend

## Overview
This backend is a minimal REST API built with **Express** and **Node.js**. It supports todo list management and task operations for each todo. The code is organized to separate routing, controllers, validation, and data storage.

## Tech Stack
- Node.js (recommended >= 18)
- JavaScript (ES modules)
- Express 5
- CORS
- Nodemon (development)

## Why JavaScript for Backend?
- JavaScript is lightweight and fast to set up for small to medium-sized APIs.
- It avoids an extra compilation layer, which keeps the backend simple for an assignment project.
- Express has a strong ecosystem and is ideal for quickly exposing REST endpoints.

## Installation
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running Locally
- Start the server in development mode (auto-restarts on change):
  ```bash
  npm run dev
  ```
- Start the server in production mode:
  ```bash
  npm start
  ```

The server listens on `http://localhost:5000` by default.

## API Endpoints
- `GET /todos` — Get all todo lists
- `POST /todos` — Create a todo list
- `DELETE /todos/:id` — Delete a todo list
- `GET /todos/:id/tasks` — Get tasks for a specific todo
- `POST /todos/:id/tasks` — Create a task inside a todo
- `PUT /tasks/:taskId` — Update task completion or details
- `DELETE /tasks/:taskId` — Delete a task

## API Response Format
All API responses follow a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": { },
  "error": null
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "error": "Clear, user-friendly error message"
}
```

## HTTP Status Codes
The API uses standardized HTTP status codes:
- **200** — Request successful
- **201** — Resource created successfully
- **400** — Bad request (validation error, duplicate names, invalid input)
- **404** — Resource not found
- **500** — Internal server error

### Example Error Scenarios
```bash
# Attempting to create a duplicate todo
POST /todos {"name": "Work"}
# Response: 400 Bad Request
{
  "success": false,
  "data": null,
  "error": "A todo list named \"Work\" already exists. Please choose a different name."
}
```

## Folder Structure
- `server.js` — entry point that starts the Express server
- `src/app.js` — Express app setup with middleware and route registration
- `src/routes/` — route definitions for todos and tasks
- `src/controllers/` — request handlers and business logic
- `src/middleware/` — validation and request middleware
- `src/store/dataStore.js` — in-memory/file-backed storage initialization
- `src/data/` — local JSON persistence for todos and tasks
- `src/utils/` — common helpers such as error response handling

## Design Notes
- The backend uses a clean separation of concerns:
  - Routing handles HTTP paths.
  - Controllers manage request/response logic.
  - Middleware validates the payloads.
  - Error handler formats all responses consistently.
- The API is intentionally small and focused so it is easy to extend.
- All error responses follow the same structure as success responses for consistency.

## Error Handling
The backend implements a comprehensive error handling strategy:

### Validation Middleware
All requests are validated before reaching controllers:
- `validateTodoName` — Ensures todo names are non-empty and unique
- `validateTaskBody` — Validates all required task fields (name, description, due date, priority)

### Global Error Handler
All errors (thrown or passed to `next()`) are caught and formatted consistently:
- Errors are caught by the Express error handler middleware
- Standardized JSON response returned to client
- No raw error messages exposed to frontend

### Common Error Messages
- Validation errors: Specific field validation failures
- Business logic errors: Duplicate names, missing resources
- Server errors: Generic error message (no internal details leaked)

## Future Improvements
- Replace JSON file storage with a proper database (SQLite, PostgreSQL, MongoDB).
- Add authentication and authorization for user-specific todo lists.
- Add pagination and filtering for tasks and todos.
- Add request validation with schemas like Joi or Zod.
- Introduce a service layer and repository pattern.
- Add unit and integration tests with Jest or Mocha.

## Why Express?
- Express is a lightweight, stable framework with broad community support.
- It provides clear routing and middleware composition.
- It is a common choice for APIs with a focus on simplicity and readability.
