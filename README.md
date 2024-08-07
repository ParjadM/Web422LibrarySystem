READ ME FILE!
Assignment 1: Library Management System

Overview
•	In this assignment, I will develop a library management system using Node.js and express for the backend, and bootstrap for the frontend UI. The system will allow users to perform CRUD operations on books and manage borrow and return transactions. This project will help me understand full-stack development, Restful API design, and CRUD operations in web application.
Objective
•	Build a Restful API using Node.js and express to manage books and borrow operations
•	Implement a frontend using HTML, CSS and bootstrap plus handlebars to interact with the backend.
•	Apply CRUD operations on books: Create, read, update, delete.
•	Implement functionality to borrow and return books
•	Use MongoDB as the database for storing book and transaction data.
Requirements – Backend (Node.js & Express)
•	Initialize a new Node.js project
•	Install necessary NPM packages: express, mongoose, body-parser, and Cors.
Database Model:
•	Use Mongoose to define models for books and transactions (borrow/return).
•	The book model should include fields such as title, author, ISBN.
•	The transaction model should include fields such as bookID, userID, borrowDate, and returnDate.
API Endpoints
•	Implement CRUD operations for books
o	GET /api/books to retrieve all books.
o	POST /api/books to add a new book. 
o	GET /api/books/:id to retrieve a book by ID.
o	PUT /api/books/:id to update a book by ID. 
o	DELETE /api/books/:id to delete a book by ID.
•	Implement endpoints for borrow and return books 
o	POST /api/borrow to borrow a book. 
o	POST /api/return to return a book
UI design
a.	Create three different sections for transaction/add book/ view/edit books
Project setup instructions
b.	Extract the file into your local machine
c.	Navigate to the file directory in visual studio code or your choice of IDE
d.	Run ‘npm install’ to install necessary dependencies
e.	Start the server by running ‘node server.js’ 
f.	Open your web browser and navigate to ‘http://localhost:3000’ to view the application
API endpoints and their usage
g.	GET /api/books: Retrieves all books.
h.	POST /api/books: Adds a new book.
i.	GET /api/books/:id: Retrieves a book by ID.
j.	PUT /api/books/:id: Updates a book by ID.
k.	DELETE /api/books/:id: Deletes a book by ID.
l.	POST /api/borrow: Borrows a book.
m.	POST /api/return: Returns a book.
Frontend design
n.	The frontend of this application is designed with bootstrap. It includes a main page that lists all books and options to add, edit, or delete a book. There is also a form to add or edit book details. A borrow interface is implemented, allowing users to borrow and return books. There is also a transaction page where it displays the history of the transaction. Finally, an add book page to add book the library system.

