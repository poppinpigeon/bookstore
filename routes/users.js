const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const {signup, login, reqPwdChange, changePwd} = require('../controller/userController')

const express = require('express');
const { sign } = require('jsonwebtoken');
const router = express.Router();

router.use(express.json());

//sign up
router.post('/signup', signup);

//login
router.post('/login', login);

//request password change
router.post('/change-pwd', reqPwdChange);

//change password
router.put('/change-pwd', changePwd);

module.exports = router;