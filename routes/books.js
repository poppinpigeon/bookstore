const express = require('express');
const router = express.Router();
const {
    viewAllBooks, 
    viewBook
} = require('../controller/bookController');

//view all books
router.get('/', viewAllBooks);

//view book
router.get('/:bookId', viewBook);

module.exports = router;
