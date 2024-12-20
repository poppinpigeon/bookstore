// const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const dotenv = require('dotenv').config();
const {StatusCodes} = require('http-status-codes');

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: 'Bookstore',
        port: process.env.DB_PORT,
        dateStrings: true
    });

    const {items, delivery, totalQuantity, totalPrice, userId, orderSummary} = req.body;

    //delivery table insert
    let sql = 'INSERT INTO delivery (address, recipient, contact) VALUES (?, ?, ?)';
    let values = [delivery.address, delivery.recipient, delivery.contact];

    let [results] = await conn.execute(sql, values);
    let delivery_id = results.insertId;

    //orders table insert
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
            VALUES (?, ?, ?, ?, ?)`;
    values = [orderSummary, totalQuantity, totalPrice, userId, delivery_id];

    [results] = await conn.execute(sql, values);
    let order_id = results.insertId;

    //select book id and quantity from cartItems using the cartItems id in items array
    sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
    let [orderItems] = await conn.query(sql, [items]);

    //orderedBook table insert
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    values = [];
    orderItems.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    });

    results = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(result[0]);

};

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;

    let result = await conn.query(sql, [items]);
    return result;
}

const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: 'Bookstore',
        port: process.env.DB_PORT,
        dateStrings: true
    });

    let {user_id} = req.body;
    user_id = parseInt(user_id);

    let sql = `SELECT orders.id, created_at, address, recipient, contact, book_title, total_quantity, total_price
                 FROM orders LEFT JOIN delivery ON orders.delivery_id = delivery.id WHERE user_id = ?`;
    let [rows] = await conn.query(sql, [user_id]);

    return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: 'Bookstore',
        port: process.env.DB_PORT,
        dateStrings: true
    });

    let {order_id} = req.params;
    order_id = parseInt(order_id);

    let sql = `SELECT book_id, title, author, price, quantity FROM orderedBook 
                LEFT JOIN books ON orderedBook.book_id = books.id 
                WHERE order_id = ?`;
    let [rows] = await conn.query(sql, [order_id]);
    return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
    order,
    getOrders,
    getOrderDetail
}