const express = require('express');
const mongoose = require('mongoose');
const Author = require('../models/Author.js');
const Book = require('../models/Book.js');

const router = express.Router();
router.use(express.json());

// GET /api/books - Get all books with author details
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// POST /api/books - Create author (if needed) + book
router.post('/', async (req, res) => {
  try {
    const books = req.body;
    const errors = [];
    let addedCount = 0;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ error: 'No books to add' });
    }

    for (let i = 0; i < books.length; i++) {
      const { frontID, name, quantity, author } = books[i];

      if (!frontID || !name || !quantity || !author?.name || !author?.email) {
        errors.push(`Book at index ${i} is missing required fields.`);
        continue;
      }

      try {
        let currAuthor = await Author.findOne({ email: author.email });

        if (currAuthor && currAuthor.name !== author.name) {
          errors.push(
            `Author name mismatch for email ${author.email} (got "${author.name}", expected "${currAuthor.name}")`
          );
          continue;
        }

        if (!currAuthor) {
          currAuthor = new Author({ name: author.name, email: author.email });
          await currAuthor.save();
        }

        const newBook = new Book({
          frontID,
          name,
          quantity,
          author: currAuthor._id,
        });

        await newBook.save();
        addedCount++;
      } catch (innerErr) {
        errors.push(`Error adding book at index ${i}: ${innerErr.message}`);
      }
    }

    res.status(207).json({
      message: `${addedCount} book(s) added successfully.`,
      errors: errors.length ? errors : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/books/:id - Edit a book by ID
router.put('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const { name, quantity, author: updatedAuthor } = req.body;

    if (!name || !quantity || !updatedAuthor?.name || !updatedAuthor?.email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const currentAuthor = await Author.findById(book.author);

    // Handle author logic
    if (currentAuthor.email !== updatedAuthor.email) {
      // Check if author exists with the new email
      let newAuthor = await Author.findOne({ email: updatedAuthor.email });
      if (!newAuthor) {
        newAuthor = new Author({
          name: updatedAuthor.name,
          email: updatedAuthor.email,
        });
        await newAuthor.save();
      }

      // Update book's author reference
      book.author = newAuthor._id;

      // Cleanup: remove old author if no other books reference them
      const count = await Book.countDocuments({ author: currentAuthor._id });
      if (count === 1) {
        await Author.findByIdAndDelete(currentAuthor._id);
      }
    } else {
      // Update name if changed and email is the same
      if (currentAuthor.name !== updatedAuthor.name) {
        currentAuthor.name = updatedAuthor.name;
        await currentAuthor.save();
      }
    }

    book.name = name;
    book.quantity = quantity;
    await book.save();

    res.json({ message: 'Book updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/books/:id - Delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/books - Delete all books and all authors
router.delete('/', async (req, res) => {
  try {
    await Book.deleteMany({});
    await Author.deleteMany({});
    res.json({ message: 'All books and authors deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Export the router so it can be used in server.js
module.exports = router;
