let sendpulse = require('sendpulse-api');
let SEND_PULSE_CONFIG = require('../config/send-pulse');

let sendPulseService = {};

sendPulseService.init = function () {
    return new Promise((resolve, reject) => {
        sendpulse.init(
            SEND_PULSE_CONFIG.API_USER_ID,
            SEND_PULSE_CONFIG.API_SECRET,
            SEND_PULSE_CONFIG.TOKEN_STORAGE,
            (token) => {
                resolve(token);
            }
        )

    });
};


sendPulseService.createAddressBook = function (name) {
    return new Promise((resolve, reject) => {
        sendpulse.createAddressBook(async (data) => {
            resolve(data);
            //data.id
        }, name)

    });
};

sendPulseService.addEmails = function (bookId, emails) {
    return new Promise((resolve, reject) => {
        sendpulse.addEmails(async (data) => {
            resolve(data);
            //data.result
        }, bookId, emails)
    });
};

sendPulseService.createCampaign = function (senderName, senderEmail, subject, body, bookId, name, attachments) {
    return new Promise((resolve, reject) => {
        sendpulse.createCampaign(async (data) => {
            resolve(data);
            //data.id
        }, senderName, senderEmail, subject, body, bookId, name, attachments)
    });
};

sendPulseService.removeEmails = function (bookId, emails) {
    return new Promise((resolve, reject) => {
        sendpulse.removeEmails(async (data) => {
            resolve(data);
        }, bookId, emails)
    });
};

sendPulseService.getEmailsFromBook = function (bookId) {
    return new Promise((resolve, reject) => {
        sendpulse.getEmailsFromBook(async (data) => {
            resolve(data);
        }, bookId)
    });
};

sendPulseService.listAddressBooks = function (limit, offset) {
    return new Promise((resolve, reject) => {
        sendpulse.listAddressBooks(async (data) => {
            resolve(data);
        }, limit, offset)
    });
};

sendPulseService.smsSend = function (name, phones, body) {
    return new Promise((resolve, reject) => {
        sendpulse.smsSend(async (data) => {
            resolve(data);
        }, name, phones, body)
    });
};



module.exports = sendPulseService;