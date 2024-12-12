const express = require('express');
const router = express.Router();
const {viewAllCategories} = require('../controller/categoryController');

//view all categories
router.get('/', viewAllCategories);

module.exports = router;