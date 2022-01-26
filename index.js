const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');

const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

mongoose.connect(process.env.DB_CONNECT, () => console.log('connected to DB !'));

app.use(express.json());
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);

app.listen(process.env.PORT || 3000);
