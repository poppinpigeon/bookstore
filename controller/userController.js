const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const crypto = require('crypto');

const signup = (req, res) => {
    const {email, pwd} = req.body;

    //save user password as hashed password and salt
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(pwd, salt, 10000, 10, 'sha512').toString('base64');

    let sql = 'INSERT INTO users (email, pwd, salt) VALUES (?, ?, ?)';
    let values = [email, hashPwd, salt];

    conn.query(sql, values,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.CREATED).json(results);
    });
};

const login = (req, res) => {
    const {email, pwd} = req.body;
    let sql = 'SELECT * FROM users WHERE email = ?'

    conn.query(sql, email, 
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            const loginUser = results[0];

            //use salt and user password input and match with hashed password during login
            const hashPwd = crypto.pbkdf2Sync(pwd, loginUser.salt, 10000, 10, 'sha512').toString('base64');
            if(loginUser && loginUser.pwd === hashPwd){
                const token = jwt.sign({
                    email: loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn: '5m',
                    issuer: 'jade'
                });

                res.cookie("token", token, {
                    httpOnly: true
                });
                console.log(token);
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};

const reqPwdChange = (req, res) => {
    const {email} = req.body;
    let sql = 'SELECT * FROM users WHERE email = ?';

    conn.query(sql, email,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            const user = results[0];
            if(user){
                return res.status(StatusCodes.OK).json({
                    email: email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
    });
};

const changePwd = (req, res) => {
    const {email, pwd} = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(pwd, salt, 10000, 10, 'sha512').toString('base64');

    sql = 'UPDATE users SET pwd = ?, salt = ? WHERE email = ?';
    let values = [hashPwd, salt, email];

    conn.query(sql, values,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows == 0){
                console.log(results)
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
    });
};

module.exports = {
    signup,
    login,
    reqPwdChange,
    changePwd
};