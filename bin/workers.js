let receiveMailApplicationsWorker = require('../workers/mail/receive-mail-applications');
let startLogging = require('../workers/log/start-logging');
let socketManager = require('./socket');

let workers = {};

workers.startReceivingEmails = function () {
    let io = socketManager.getIo();
    receiveMailApplicationsWorker()
        .then((mail) => {
            io.emit('mail', mail);
        })
        .catch((err) => {
            console.log(err);
            io.emit('error', err);
        });
};

workers.startLogging = function () {
    startLogging();
};

module.exports = workers;