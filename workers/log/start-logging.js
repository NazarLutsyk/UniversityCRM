let winston = require('winston');
let path = require('path');
let mkdirp = require('mkdirp');

let logPath = path.join(__dirname, '../../runtime', '/logs');


module.exports = function () {
    mkdirp(logPath, function (err) {
        if (err) {
            throw new Error(err);
        }
    });

    winston.configure({
        exceptionHandlers: [
            new winston.transports.File({
                filename: path.join(logPath, 'errors.log'),
            })
        ]
    });
};