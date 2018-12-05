let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let queryParser = require('./helpers/query-parser');
let cors = require('cors');
let apiRouter = require('./routes/api');

let app = express();

app.use(cors({origin: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(queryParser());

app.get('/', (req, res, next) => {
    res.end('OWU CRM API');
});

app.use('/api', apiRouter);


app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json(err);
});

module.exports = app;
