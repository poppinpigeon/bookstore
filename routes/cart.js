const {addToCart, getCartItems, removeCartItem} = require('../controller/cartController');
const express = require('express');
const router = express.Router();

router.use(express.json());

//add to cart
router.post('/', addToCart);

//view cart, view selected items from cart
router.get('/', getCartItems);

//remove from cart
router.delete('/:cartItem_id', removeCartItem);

module.exports = router;