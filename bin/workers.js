let receiveMailApplicationsWorker = require('../workers/mail/receive-mail-applications');
let startLogging = require('../workers/log/start-logging');
let socketManager = require('./socket');
let db = require('../db/models');

let workers = {};

workers.startReceivingEmails = function () {
    let io = socketManager.getIo();
    let mailEvents = receiveMailApplicationsWorker;
    mailEvents.on('data', async (mail) => {
        await db.eapplication.create(mail.json);
        io.emit('mail', mail);
    });
    mailEvents.on('error', (err) => {
        console.log(err);
        io.emit('error', err);
    })
};

workers.startLogging = function () {
    startLogging();
};

module.exports = workers;
