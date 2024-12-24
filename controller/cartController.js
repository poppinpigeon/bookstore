const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const ensureAuthorization = require('../auth');

const addToCart = (req, res) => {
    const {book_id, quantity} = req.body;

    const authorization = ensureAuthorization(req);
    if(authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "token expired."
        });
    } else if(authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "invalid token."
        });
    } else {
        let sql = 'INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)';
        let values = [book_id, quantity, authorization.id];
    
        conn.query(sql, values,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        });
    }
};

const getCartItems = (req, res) => {
    const {selected} = req.body;

    const authorization = ensureAuthorization(req);
    if(authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "token expired."
        });
    } else if(authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "invalid token."
        });
    } else {
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
        FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id WHERE user_id = ?`;
        let values = [authorization.id];

        if(selected){
            sql += ` AND cartItems.id IN (?)`;
            values.push(selected);
        }

        conn.query(sql, values,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        });
    }
};

const removeCartItem = (req, res) => {
    const authorization = ensureAuthorization(req);
    if(authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "token expired."
        });
    } else if(authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "invalid token."
        });
    } else {
        const {cartItem_id} = req.params;

        let sql = 'DELETE FROM cartItems WHERE id = ?';
        let values = [cartItem_id];
    
        conn.query(sql, values,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        });
    }
};

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
}