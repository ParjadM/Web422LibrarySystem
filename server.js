const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const Handlebars = require("handlebars");
const app = express();
const port = 3000;

//mongoose connection
const uri = "mongodb+srv://minooeip:minooei89@cluster0.c7gpila.mongodb.net/";
const dbName = "Web422";

//mondels
const Book = require("./models/book");
const Transaction = require("./models/transaction");

//connect to mongoose
mongoose
  .connect(uri, { dbName })
  .then(() => {
    mongoose.connection.db
      .listCollections()
      .toArray()
      .then((collections) => {
        if (!collections.some((c) => c.name === "books")) {
          Book.createCollection();
        }
        if (!collections.some((c) => c.name === "transactions")) {
          Transaction.createCollection();
        }
      });
  })
  .catch((err) => console.error("Could not connect to MongoDB Atlas:", err));

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// handlebars Setup
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

//including helpers
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: false,
    helpers: {
      formatDate: function (date) {
        return format(new Date(date), "yyyy-MM-dd");
      },
      lookupBorrower: function (transaction) {
        return transaction.userId;
      },
      lookupActiveTransaction: async function (bookId) {
        try {
          const transaction = await Transaction.findActiveTransaction(bookId);
          return transaction;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      isEditing: function (book) {
        return book.isEditing;
      },
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// Session Configuration
app.use(
  session({
    secret: "secretshh",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.render("index", { books });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Internal Server Error");
  }
});

//Add Book page
app.get("/add-book", (req, res) => {
  //render addBookForm.hbs
  res.render("addBookForm", { errorMessage: null });
});

//post /api/books
app.post("/api/books", (req, res) => {
  const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
  });

  newBook
    .save()
    .then(() => res.json({ message: "Book added successfully!" }))
    .catch((err) => res.status(400).json({ error: err }));
});

//used for deleting books
app
  .route("/api/books/:id")
  .get(async (req, res) => {
    try {
      const books = await Book.find();
      const formattedBooks = books.map((book) => ({
        _id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        links: {
          self: `/api/books/${book._id}`,
          edit: `/api/books/${book._id}/edit`,
          delete: `/api/books/${book._id}/delete`,
        },
      }));
      res.json(formattedBooks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const bookId = req.params.id;

      if (req.body._method === "DELETE") {
        await Transaction.deleteMany({ book: bookId });

        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
          return res.status(404).send("Book not found");
        }

        //Redirect to the book list after deleting
        res.redirect("/books");
      }
    } catch (err) {
      console.error("Error processing book:", err);
      res.status(500).send("Error processing book");
    }
  });

// populate booklist
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().populate("transactions");
    const plainBooks = books.map((book) => book.toObject());
    res.render("allBooksList", {
      books: plainBooks,
      userId: req.session.userId || null,
    });
  } catch (err) {
    console.error("Error fetching books:", err.message);
    res.status(500).send("Error fetching books");
  }
});

//fetch book data
async function fetchBooksData() {
  try {
    //fetch all books with transactions
    return await Book.find().populate("transactions");
  } catch (err) {
    console.error("Error fetching books:", err);
    throw err;
  }
}

// GET new books
app.get("/books/new", async (req, res) => {
  try {
    
    let books = await fetchBooksData();

    
    let transactions = await Transaction.find();

    //render the view
    res.render("book", { books: books, transactions: transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//edit book by title
app.post("/api/books/:id", function (req, res) {
  //Get the book ID and new title from the request
  const bookId = req.params.id;
  const newTitle = req.body.title;

  updateBookTitle(bookId, newTitle);

  //Get the updated book information from the database
  var updatedBook = getBookById(bookId);

  //render the same page with the updated book information
  res.render("edit", { title: updatedBook.title, id: updatedBook._id });

  console.log("Response sent");
});

// function for updatebook title
function updateBookTitle(id, title) {
  // Find the book by id and update its title
  Book.findByIdAndUpdate(id, { title: title }, function (err, result) {
    if (err) {
      console.log("Error updating book:", err);
    } else {
      console.log("Book updated successfully");
    }
  });
}

// Put to update book by title
app.put("/api/books/:id", async (req, res) => {
  const bookId = req.params.id;
  const newTitle = req.body.title;

  try {
    // Find the book by bookId and update its title
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title: newTitle },
      { new: true }
    );

    if (!updatedBook) {
      res.status(404).send("Book not found");
    } else {
      res.send("Book title updated successfully");
    }
  } catch (err) {
    res.status(500).send("An error occurred while updating the book");
  }
});

//Post for Borrowing book important
app.post("/api/borrow", async (req, res) => {
  try {
    const { bookId, username } = req.body;

    // check if bookId and username are provided
    if (!username || !bookId) {
      return res.redirect(
        "/books?error=" + encodeURIComponent("Username or Book ID not provided")
      );
    }

    //Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.redirect(
        "/books?error=" + encodeURIComponent("Book not found")
      );
    }

    //Check if the book is available
    if (book.isBorrowed) {
      return res.redirect(
        "/books?error=" + encodeURIComponent("Book is already borrowed")
      );
    }

    //Create a new transaction with the username
    const transaction = new Transaction({
      bookId: bookId,
      userId: username,
      borrowDate: new Date(),
    });
    try {
      const savedTransaction = await transaction.save();
      console.log("Transaction successfully updated");
      transaction
        .save()
        .catch((err) => console.error("Error saving transaction:", err));
    } catch (err) {
      console.log(err);
    }

    //Update the book status 
    book.isBorrowed = true;
    const updatedBook = await book.save();

    res.redirect("/books");
  } catch (err) {
    //error handling
    console.error("Error borrowing book:", err.message);
    res.redirect(
      "/books?error=" +
        encodeURIComponent("Failed to borrow book: " + err.message)
    );
  }
});

//Post for Returning books
const ObjectId = mongoose.Types.ObjectId;

app.post("/api/return", async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).send("bookId is undefined");
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.redirect(
        "/books?error=" + encodeURIComponent("Book not found")
      );
    }

    if (!book.isBorrowed) {
      return res.redirect(
        "/books?error=" + encodeURIComponent("This book has not been borrowed")
      );
    }

    // update the book status
    book.isBorrowed = false;
    await book.save();

    // find the existing transaction and update the return date
    const transaction = await Transaction.findOne({
      bookId: bookId,
      returnDate: null,
    });

    if (transaction) {
      transaction.returnDate = new Date();
      const savedTransaction = await transaction.save();
    }

    res.redirect("/books");
  } catch (err) {
    console.error("Error returning book:", err.message);
    res.redirect(
      "/books?error=" +
        encodeURIComponent("Error returning book: " + err.message)
    );
  }
});

app.use(function (req, res) {
  res.status(404).send("Sorry, couldn't find that!");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
