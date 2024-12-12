const dotenv = require('dotenv').config();

const express = require('express');
const app = express();
app.listen(process.env.PORT_NUM);

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/orders');

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
