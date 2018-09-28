let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let apiRouter = require('./routes/api');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    console.log(req.query);

    let query = {};

    query.skip = req.query.skip ? +req.query.skip : 0;
    query.limit = req.query.limit ? +req.query.limit : null;
    query.fields = req.query.fields ? req.query.fields.split(',') : null;

    //todo

    console.log(query);

    next();
});

app.use('/api', apiRouter);

app.get('/', (req, res, next) => {
   res.end('OWU CRM API');
});

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
