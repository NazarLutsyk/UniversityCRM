let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let session = require('express-session');
let helmet = require('helmet');
let guard = require('node-auth-guard');
let db = require('./db/models');
let SequelizeStore = require('connect-session-sequelize')(session.Store);

require('./config/passport');
let passport = require('passport');

let queryParser = require('./helpers/query-parser');
let apiRouter = require('./routes/api');

let sessionStore = new SequelizeStore({
    db: db.sequelize,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 7 * 24 * 60 * 60 * 1000
});
sessionStore.sync();

let app = express();

app.use(cors({origin: true, credentials: true}));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'KHkhSdlasd54sdaSdad44',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));
app.use(queryParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(guard.initialize({
    principalPath: 'user',
    rolesField: 'role'
}));

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
    res.send({message: err.msg, name: err.name});
});

module.exports = app;
