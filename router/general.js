const express = require('express');
const public_users = express.Router();
const axios = require('axios');


// Sample data for tasks
const books = [
    { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", price: 10.99 },
    { id: 2, title: "1984", author: "George Orwell", price: 8.99 },
    { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 12.49 },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", price: 6.99 },
];
const reviews = {
    1: ["Excellent book!", "A timeless classic."],
    2: ["Very thought-provoking.", "A chilling dystopia."],
    3: ["Beautifully written.", "An American classic."],
    4: ["Romantic and witty.", "A wonderful read."],
};
const users = [];

public_users.get('/', async (req, res) => {
    try {
        const booksList = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(books), 1000); // Simulating async fetch
        });
        res.status(200).send(JSON.stringify(booksList, null, 2));
    } catch (error) {
        res.status(500).send("Error fetching books.");
    }
});


public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books.find(book => book.id === parseInt(isbn));
            book ? resolve(book) : reject("Book not found");
        }, 1000);
    })
        .then(book => res.status(200).send(JSON.stringify(book, null, 2)))
        .catch(error => res.status(404).send(error));
});


public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params.toLowerCase();
    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const results = books.filter(book => book.author.toLowerCase() === author);
                results.length > 0 ? resolve(results) : reject("No books found by this author");
            }, 1000);
        });
        res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
    } catch (error) {
        res.status(404).send(error);
    }
});


public_users.get('/title/:title', (req, res) => {
    const { title } = req.params.toLowerCase();
    new Promise((resolve, reject) => {
        setTimeout(() => {
            const results = books.filter(book => book.title.toLowerCase() === title);
            results.length > 0 ? resolve(results) : reject("No books found with this title");
        }, 1000);
    })
        .then(results => res.status(200).send(JSON.stringify(results, null, 2)))
        .catch(error => res.status(404).send(error));
});


// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const bookReviews = reviews[isbn];
    bookReviews ? res.status(200).send(JSON.stringify(bookReviews, null, 2)) : res.status(404).send("No reviews found for this book");
});

// Task 6: Register new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("Username and password are required");
    const userExists = users.some(user => user.username === username);
    if (userExists) return res.status(400).send("Username already exists");
    users.push({ username, password });
    res.status(201).send("User registered successfully");
});

module.exports.general = public_users;
