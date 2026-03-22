# Copilot Instructions — Books CRUD API

## Architecture

Single-file Express API (`index.js`) serving CRUD endpoints for books with JWT authentication. No database — data lives in an in-memory `books` array that resets on restart. Designed as a teaching tool for API test automation, not for production use.

### Key components in `index.js`:

- **Auth**: `POST /auth/login` issues a JWT (hardcoded credentials: `rv@tai.com` / `learnwithrv`, secret: `mysecretkey`)
- **Public routes**: `GET /books`, `GET /books/:id`
- **Protected routes**: `GET /private/books`, `POST /books`, `PUT /books/:id`, `DELETE /books/:id` — guarded by `authenticateToken` middleware
- **Swagger**: auto-generated from JSDoc annotations in `index.js`, served at `/api-docs`

## Running the project

```sh
npm install
npm run start        # runs `node index.js` on port 3000
```

Docker alternative: `docker run -d --rm -p 8088:3000 --name books-crud-rest-api-app rvancea/books-crud-rest-api-app`

## Conventions & patterns

- **Single-file structure**: All routes, middleware, and config are in `index.js`. Keep it that way — the simplicity is intentional for educational use.
- **Swagger docs**: Every route has a `@swagger` JSDoc block directly above its handler. When adding/modifying endpoints, always update the corresponding JSDoc annotation.
- **Book model**: `{ id: number, title: string, author: string }`. IDs are assigned as `books.length + 1` (not UUIDs, not auto-decrement-safe after deletes).
- **Auth middleware pattern**: Bearer token in `Authorization` header → `authenticateToken` verifies with `jsonwebtoken` and attaches `req.user`.
- **Error responses**: Always return JSON `{ message: string }` with appropriate HTTP status codes (400, 401, 403, 404).
- **No test framework**: The project uses a Postman collection (`rv-books-app.postman_collection.json`) for manual/automated API testing instead of unit tests.

## Dependencies (Express 5)

This project uses **Express 5.1** and **body-parser 2.2**. Avoid patterns deprecated in Express 5 (e.g., `app.del()`, old `req.param()` usage). The `swagger-jsdoc` + `swagger-ui-express` combo powers the interactive docs.

## When modifying endpoints

1. Add the route handler with inline `@swagger` JSDoc
2. Validate required fields and return `400` with a `{ message }` body on failure
3. Apply `authenticateToken` middleware for any write/private operation
4. Keep response shapes consistent: single book object or array of books
