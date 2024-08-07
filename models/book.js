const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    isbn: {
      type: String,
      required: true,
      unique: true 
    },
    isBorrowed: { type: Boolean, default: false },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
  });
  

const Book = mongoose.model('Book', bookSchema); 

module.exports = Book;
