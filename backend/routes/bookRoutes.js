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
      const { name, quantity, author } = books[i];

      if (!name || !quantity || !author?.name || !author?.email) {
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


// Export the router so it can be used in server.js
module.exports = router;
