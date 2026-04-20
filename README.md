# Todo List Application

This is a full-stack Todo List application built using a modern frontend and a lightweight backend architecture. The project demonstrates clean separation of concerns, RESTful API design, and scalable structuring suitable for production-oriented systems.

---

## Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express

---

## Project Structure

```
todoList-app/
  ├── frontend/     # React application (user interface)
  └── backend/      # Express server (API layer)
```

* The **frontend** handles user interaction, routing, and UI rendering.
* The **backend** exposes REST APIs and manages application logic.

---

## Architecture Overview

The application follows a standard client-server architecture:

* The frontend communicates with the backend through RESTful APIs.
* The backend processes requests and returns structured responses.
* The system is designed to allow easy replacement of the data layer without affecting business logic.

---

## Data Storage

This application does not use a database.

* Data is maintained using **in-memory storage** during runtime.
* Mock data can be initialized using **JSON files**.
* Any changes made during execution are not permanently persisted unless explicitly written back to files.

This approach keeps the setup simple while allowing focus on application structure and logic.

---

## Features

### Todo Management

* Create and delete todo lists
* Unique naming validation
* Display of completed vs total task counts
* Automatic completion status based on tasks

### Task Management

* Create, update, and delete tasks
* Mark tasks as complete or incomplete
* Inline editing for active tasks
* Validation for required fields and uniqueness
* Task attributes include description, due date, and priority

---

## API Design

The backend exposes REST endpoints for todos and tasks, following standard HTTP methods:

* GET, POST, PUT, DELETE
* Structured responses with consistent error handling
* Validation at the API level to ensure data integrity

---

## Frontend Design

* Component-based architecture
* API service layer using Axios
* Centralized error handling via interceptors
* Clean and responsive UI using Tailwind CSS
* Focus on usability and clarity

---

## Running the Application

### Backend

```
cd backend
npm install
npm run start
```

The backend server runs on:
http://localhost:5000

---

### Frontend

```
cd frontend
npm install
npm run dev
```

The frontend application runs on:
http://localhost:3000 (or Vite default port)

---

## Notes

* This project is designed without a database for simplicity.
* The architecture allows easy migration to a persistent data store such as PostgreSQL or MongoDB.
* The current structure supports scalability through separation of concerns and modular design.

---

## Future Improvements

* Integration with a persistent database
* Authentication and user management
* Pagination and filtering
* Improved state management
* Enhanced logging and monitoring

---

This project is intended to demonstrate clean engineering practices, maintainable code structure, and production-ready design principles.
