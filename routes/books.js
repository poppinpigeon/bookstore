const express = require('express');
const router = express.Router();

//view all books
router.get('/', (req, res) => {
    res.json('view all books');
});

//view book
router.get('/:bookId', (req, res) => {
    res.json('view book');
});

//view books by category
router.get('/', (req, res) => {
    // req.query.categoryId
    res.json('view books by category');
});

module.exports = router;
