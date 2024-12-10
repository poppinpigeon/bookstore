const express = require('express');
const router = express.Router();

router.use(express.json());

//sign up
router.post('/signup', (req, res) => {
    res.json('signup');
});

//login
router.post('/login', (req, res) => {
    res.json('login');
});

//request password change
router.post('/change-pwd', (req, res) => {
    res.json('req pwd change');
});

//change password
router.put('/change-pwd', (req, res) => {
    res.json('change pwd');
});

module.exports = router;