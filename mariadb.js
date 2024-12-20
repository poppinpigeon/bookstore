const mariadb = require('mysql2');
const dotenv = require('dotenv').config();

const conn = mariadb.createConnection({
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: 'Bookstore',
    port: process.env.DB_PORT,
    dateStrings: true
});

module.exports = conn;
