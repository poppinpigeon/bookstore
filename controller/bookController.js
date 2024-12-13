const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const viewAllBooks = (req, res) => {
    let {category_id, recent, limit, current_page} = req.query;
    limit = parseInt(limit);
    let offset = limit * (current_page-1);

    let sql = 'SELECT * FROM books';
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
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        });
};

const viewBook = (req, res) => {
    let {bookId} = req.params;
    bookId = parseInt(bookId);

    let sql = `SELECT * FROM books LEFT JOIN category 
                ON books.category_id = category.id WHERE books.id = ?`;

    conn.query(sql, bookId, 
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
};

module.exports = {
    viewAllBooks, 
    viewBook
};
