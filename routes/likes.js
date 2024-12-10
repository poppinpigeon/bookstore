const express = require('express');
const router = express.Router();

router.use(express.json());

//add like
router.post('/:bookId', (req, res) => {
    res.json('add like');
});

//remove like
router.delete('/:bookId', (req, res) => {
    res.json('remove like');
});

module.exports = router;