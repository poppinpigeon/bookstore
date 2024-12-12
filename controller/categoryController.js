const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const viewAllCategories = (req, res) => {
    let sql = 'SELECT * FROM category';

    conn.query(sql, 
    (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }
    });
}

module.exports = {viewAllCategories};