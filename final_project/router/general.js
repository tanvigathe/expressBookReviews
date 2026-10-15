const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Unable to register user." });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});

// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const book = books[req.params.isbn];
        if (!book) return res.status(404).json({ message: "Book not found" });
        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve book" });
    }
});

// Get books by author using Promise
public_users.get('/author/:author', (req, res) => {
    Promise.resolve(Object.values(books).filter(book =>
        book.author &&
        book.author.toLowerCase() === req.params.author.toLowerCase()
    ))
    .then(result => res.status(200).json(result))
    .catch(() => res.status(500).json({ message: "Unable to retrieve books" }));
});

// Get books by title using async/await
public_users.get('/title/:title', async (req, res) => {
    try {
        const result = Object.values(books).filter(book =>
            book.title &&
            book.title.toLowerCase() === req.params.title.toLowerCase()
        );
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve books" });
    }
});

// Get book review by ISBN
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;
