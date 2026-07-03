# Web422 Library System

A Node.js and Express library management app built for Web422. The application uses Handlebars for server-rendered pages, MongoDB Atlas for persistence, and Mongoose models for books and transactions.

## Features

- View the library book list
- Add, edit, and delete books
- Borrow and return books
- Track active and completed transactions
- Render pages with Handlebars templates

## Tech Stack

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Handlebars
- Body Parser
- CORS
- Express Session

## Project Structure

- `server.js` - app entry point, routes, and server setup
- `models/book.js` - book schema
- `models/transaction.js` - transaction schema
- `views/` - Handlebars templates

## Data Models

### Book

- `title` - required string
- `author` - required string
- `isbn` - required unique string
- `isBorrowed` - boolean flag for availability
- `transactions` - related transaction references

### Transaction

- `bookId` - reference to a book
- `userId` - borrower name or identifier
- `borrowDate` - date the book was borrowed
- `returnDate` - date the book was returned

## Getting Started

### Prerequisites

- Node.js installed locally
- Access to a MongoDB Atlas cluster or another MongoDB instance

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Update the MongoDB connection string in `server.js` with your own credentials.

### Run the App

```bash
npm start
```

The app runs on `http://localhost:3000`.

## Available Routes

### Pages

- `GET /` - home page with the book list
- `GET /books` - rendered book list page
- `GET /books/new` - rendered book and transaction view
- `GET /add-book` - add book form

### API

- `POST /api/books` - create a new book
- `GET /api/books/:id` - retrieve books data
- `PUT /api/books/:id` - update a book title
- `POST /api/books/:id` - delete a book when `_method=DELETE` is posted
- `POST /api/borrow` - borrow a book
- `POST /api/return` - return a book

## Notes

- The MongoDB connection string is currently hardcoded in `server.js`.
- The app expects the `books` and `transactions` collections to exist or be created automatically on startup.
- Some routes are designed for server-rendered views rather than a pure JSON API.

