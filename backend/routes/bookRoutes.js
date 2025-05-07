const express = require('express');
const mongoose = require('mongoose');
const Author = require('../models/Author.js');
const Book = require('../models/Book.js');

const router = express.Router();
router.use(express.json());

// POST /api/books - Create author (if needed) + book
router.post('/books', async (req, res) => {
  try {
    const books = req.body;

    for (let bookData of books) {
      const { name, quantity, author } = bookData;

      if (!name || !author.name || !author.email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let currAuthor = await Author.findOne({ email: author.email });
      if (!currAuthor) {
        currAuthor = new Author({ name: author.name, email: author.email });
        await currAuthor.save();
      }

      const newBook = new Book({
        name,
        quantity,
        author: currAuthor._id,
      });
      await newBook.save();
    }

    res.status(201).json({ message: 'Books added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Export the router so it can be used in server.js
module.exports = router;
