const express = require('express');
const router = express.Router();
const {
    viewAllBooks, 
    viewBook
} = require('../controller/bookController');

router.use(express.json());

//view all books
router.get('/', viewAllBooks);

//view book
router.get('/:book_id', viewBook);

module.exports = router;
