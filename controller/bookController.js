const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const ensureAuthorization = require('../auth');

const viewAllBooks = (req, res) => {
    let allBooksResponse = {};
    let {category_id, recent, limit, current_page} = req.query;
    limit = parseInt(limit);
    let offset = limit * (current_page-1);

    let sql = 'SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE books.id = book_id) AS likes FROM books';
    let values = [];
    if(category_id && recent){
        sql += ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values.push(category_id);
    } else if(category_id){
        sql += ' WHERE category_id = ?';
        values.push(category_id);
    } else if(recent){
        sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    }

    sql += ' LIMIT ? OFFSET ?';
    values.push(limit, offset);

    conn.query(sql, values, 
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.length){
                allBooksResponse.books = results;
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    });
    
    sql = `SELECT found_rows()`;
    conn.query(sql,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            let pagination = {};
            pagination.current_page = parseInt(current_page);
            pagination.total_count = results[0]["found_rows()"];

            allBooksResponse.pagination = pagination;

            return res.status(StatusCodes.OK).json(allBooksResponse);
    });
};

const viewBook = (req, res) => {
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
        let {book_id} = req.params;
        book_id = parseInt(book_id);

        let sql = ``;
        let values = [];

        if(authorization instanceof ReferenceError){
            sql = `SELECT *, (SELECT count(*) FROM likes WHERE books.id = book_id) AS likes
                        FROM books LEFT JOIN category 
                        ON books.category_id = category.category_id WHERE books.id = ?`;
            values = [book_id];
        } else {
            sql = `SELECT *, (SELECT count(*) FROM likes WHERE books.id = book_id) AS likes,
            (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND book_id = ?)) AS liked
            FROM books LEFT JOIN category 
            ON books.category_id = category.category_id WHERE books.id = ?`;
            values = [authorization.id, book_id, book_id];
        }
    
        conn.query(sql, values, 
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
    
            if(results[0]){
                return res.status(StatusCodes.OK).json(results[0]);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        });
    }
};

module.exports = {
    viewAllBooks, 
    viewBook
};
