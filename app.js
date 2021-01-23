require('dotenv').config();
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');

const cors = require('cors');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const apiV1Router = require('./v1/routes/routeAll.js');

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected to database');
});


app.use('/v1', apiV1Router);
app.get('/', (req, res) => {
    res.send('Helo motherfucker');
});

app.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
});