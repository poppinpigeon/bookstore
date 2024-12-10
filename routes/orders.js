const express = require('express');
const router = express.Router();

router.use(express.json());

//order
router.post('/', (req, res) => {
    res.json('order');
});

//view orders
router.get('/', (req, res) => {
    res.json('view orders');
});

//view order details
router.get('/:orderId', (req, res) => {
    res.json('view order details');
});

module.exports = router;