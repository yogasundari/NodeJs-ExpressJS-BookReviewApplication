const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

// In-memory user data for authentication
const users = [
    { username: 'john', password: '1234' },
    { username: 'jane', password: '5678' },
];

// In-memory data structure for reviews
const reviews = {
    1: [{ username: 'john', review: 'Great book!' }],
    2: [{ username: 'jane', review: 'Thought-provoking!' }],
};

// Secret key for JWT
const SECRET_KEY = "your_secret_key";

// Helper function to authenticate user
function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

// Task 7: Login route
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    const user = authenticateUser(username, password);

    if (!user) {
        return res.status(401).send("Invalid credentials");
    }

    // Generate JWT
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    // Send token as response
    res.status(200).send({ message: "Login successful", token });
});

// Middleware to verify JWT and extract username
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send("Token required");
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid token");
        }
        req.username = decoded.username;
        next();
    });
}

// Task 8: Add/modify book review
regd_users.post('/auth/review/:isbn', verifyToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.username;

    if (!review) {
        return res.status(400).send("Review is required");
    }

    if (!reviews[isbn]) {
        reviews[isbn] = [];
    }

    // Check if the user already posted a review for the given ISBN
    const existingReview = reviews[isbn].find(r => r.username === username);

    if (existingReview) {
        existingReview.review = review; // Modify the existing review
        return res.status(200).send("Review updated successfully");
    }

    // Add a new review
    reviews[isbn].push({ username, review });
    res.status(201).send("Review added successfully");
});

// Task 9: Delete book review
regd_users.delete('/auth/review/:isbn', verifyToken, (req, res) => {
    const { isbn } = req.params;
    const username = req.username;

    if (!reviews[isbn]) {
        return res.status(404).send("No reviews found for this ISBN");
    }

    // Filter reviews to exclude the one from the logged-in user
    const initialLength = reviews[isbn].length;
    reviews[isbn] = reviews[isbn].filter(r => r.username !== username);

    if (initialLength === reviews[isbn].length) {
        return res.status(404).send("No review found to delete for this user");
    }

    res.status(200).send("Review deleted successfully");
});

module.exports.authenticated = regd_users;
