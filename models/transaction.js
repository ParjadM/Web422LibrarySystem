const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const transactionSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book', 
    required: true
  },
  userId: { 
    type: String, 
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date, 
    default: null 
  }
});

  transactionSchema.statics.findActiveTransaction = async function(bookId) {
  return await this.findOne({ bookId: bookId, returnDate: null });
};

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
