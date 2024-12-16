const {addLike, removeLike} = require('../controller/likeController');

const express = require('express');
const router = express.Router();

router.use(express.json());

//add like
router.post('/:book_id', addLike);

//remove like
router.delete('/:book_id', removeLike);

module.exports = router;