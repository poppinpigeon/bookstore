const mariadb = require('mysql2/promise');
const dotenv = require('dotenv').config();

const connection = async () => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: 'Bookstore',
        port: process.env.DB_PORT,
        dateStrings: true
    });
    return conn;
}

module.exports = connection;
