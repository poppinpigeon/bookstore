const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const ensureAuthorization = require('../auth');

const addLike = (req, res) => {
    const {book_id} = req.params;

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
        let sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';
        let values = [authorization.id, book_id];
    
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

const removeLike = (req, res) => {
    const {book_id} = req.params;
    
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
        let sql = 'DELETE FROM likes WHERE user_id = ? AND book_id = ?';
        let values = [authorization.id, book_id];
    
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
    addLike, 
    removeLike
};