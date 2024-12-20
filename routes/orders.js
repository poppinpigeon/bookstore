const {order, getOrders, getOrderDetail} = require('../controller/orderController');
const express = require('express');
const router = express.Router();

router.use(express.json());

//order
router.post('/', order);

//view orders
router.get('/', getOrders);

//view order details
router.get('/:order_id', getOrderDetail);

module.exports = router;