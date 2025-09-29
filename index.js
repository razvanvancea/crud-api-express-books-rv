const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Secret key for JWT (for demo purposes only)
const SECRET_KEY = 'mysecretkey';

// In-memory database (array for simplicity)
let books = [
  { id: 1, title: '1984', author: 'George Orwell' },
  { id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }
];

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '1.0.0',
      description: 'A simple CRUD API with authentication for teaching API test automation'
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ['./index.js'], // points to this file for annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// AUTH endpoint: login to get token
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to get JWT token email rv@tai.com password learnwithrv
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token generated
 *       401:
 *         description: Invalid credentials
 */
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'rv@tai.com' && password === 'learnwithrv') {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// CREATE a new book
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created
 */
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required.' });
  }
  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// READ all books (public)
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books (public)
 *     responses:
 *       200:
 *         description: List of books
 */
app.get('/books', (req, res) => {
  res.json(books);
});

// READ all books (private, requires token)
/**
 * @swagger
 * /private/books:
 *   get:
 *     summary: Get all books (private, requires Bearer token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of books
 *       401:
 *         description: Unauthorized
 */
app.get('/private/books', authenticateToken, (req, res) => {
  res.json(books);
});

// READ a single book by ID
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single book
 *       404:
 *         description: Book not found
 */
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  res.json(book);
});

// UPDATE a book by ID
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated
 *       404:
 *         description: Book not found
 */
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found.' });

  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

// DELETE a book by ID
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).json({ message: 'Book not found.' });

  const deletedBook = books.splice(bookIndex, 1);
  res.json(deletedBook[0]);
});

// Security scheme for Swagger
swaggerOptions.definition.components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  }
};

// Start server
app.listen(port, () => {
  console.log(`Books API running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});