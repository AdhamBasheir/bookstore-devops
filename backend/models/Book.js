const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  frontID: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
