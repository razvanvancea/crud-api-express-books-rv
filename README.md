📚 Books CRUD API with Authentication, created by [RV](https://razvanvancea.ro)

A simple Node.js + Express CRUD API to manage books, with JWT authentication and Swagger documentation. Perfect for learning and teaching API test automation.

🚀 Features

Create, Read, Update, Delete (CRUD) operations for books

Public and Private (JWT-protected) endpoints

Simple authentication with /auth/login

Swagger documentation at /api-docs

In-memory data storage (no database required)

📦 Installation

Clone this repository.

Install dependencies:

```
npm install
```

Start the app with:

```
npm run start
```

Server will run at: http://localhost:3001

Swagger docs: http://localhost:3001/api-docs

🔑 Authentication

Login to get a JWT token:

POST /auth/login
Content-Type: application/json

{
"email": "rv@tai.com",
"password": "learnwithrv"
}

If successful, you’ll receive a token:

{ "token": "<JWT_TOKEN>" }

Use this token for protected endpoints:

Authorization: Bearer <JWT_TOKEN>
📖 API Endpoints
🔓 Public

POST /auth/login → Get JWT token (email: rv@tai.com, password: learnwithrv)

GET /books → Get all books

GET /books/{id} → Get book by ID

🔒 Private (requires JWT)

GET /private/books → Get all books (requires Authorization: Bearer <token>)

POST /books → Create a book

PUT /books/{id} → Update book by ID

DELETE /books/{id} → Delete book by ID

📑 Swagger Documentation

Available at: http://localhost:3001/api-docs

Provides interactive API explorer for all endpoints

Supports testing with JWT Bearer authentication

🧑‍💻 Example Flow

Login with /auth/login using email & password.

Copy the token from the response.

Authorize in Swagger UI or add Authorization: Bearer <token> in Postman.

Test the protected endpoint /private/books.

📦 Docker

docker run -d --rm -p 8088:3001 --name books-crud-rest-api-app rvancea/books-crud-rest-api-app
