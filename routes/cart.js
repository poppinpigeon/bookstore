const express = require('express');
const router = express.Router();

router.use(express.json());

//add to cart
router.post('/', (req, res) => {
    res.json('add to cart');
});

//view cart
router.get('/', (req, res) => {
    res.json('view cart');
});

//remove from cart
router.delete('/:bookId', (req, res) => {
    res.json('remove from cart');
});

//view selected items from cart
// router.get('/', (req, res) => {
//     res.json('view selected items from cart');
// });

module.exports = router;