let ControllerError = require('../errors/ControllerError');
let db = require('../db/models');
let sendpulse = require('../services/sendpulse-service');

let controller = {};

controller.smsSending = async function (req, res, next) {
    try {
        const {text, phones} = req.body;
        if (text && phones && phones.length > 0) {
            let token = await sendpulse.init();

            let sendingRes = await sendpulse.smsSend(
                'OWU',
                phones,
                text
            );
            if (sendingRes.result) {
                res.json({ok: true});
            } else {
                next(new ControllerError(sendingRes.message, 500, 'Sending controller'));
            }
        } else {
            next(new ControllerError('Missed required parameters', 400, 'Sending controller'));
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Sending controller'));
    }
};

controller.emailSending = async function (req, res, next) {
    try {
        const {text, emails} = req.body;
        if (text && emails && emails.length > 0) {
            const userBookName = req.user.id + 'OWU';

            let token = await sendpulse.init();
            console.log('TOKEN:');
            console.log(token);

            let listAddressBooks = await sendpulse.listAddressBooks();

            let mainAddressBook = null;
            if (listAddressBooks && listAddressBooks.length > 0) {
                let mainBookIndex = listAddressBooks.findIndex(b => b.name === userBookName);
                if (mainBookIndex > -1) {
                    mainAddressBook = listAddressBooks[mainBookIndex];
                }
            }
            if (!mainAddressBook) {
                mainAddressBook = await sendpulse.createAddressBook(userBookName);
            }
            console.log('BOOK ID:');
            console.log(mainAddressBook.id);
            if (mainAddressBook.id) {
                let oldEmails = await sendpulse.getEmailsFromBook(mainAddressBook.id);
                console.log('OLD EMAILS:');
                console.log(oldEmails);
                if (oldEmails && oldEmails.length > 0) {
                    await sendpulse.removeEmails(mainAddressBook.id, oldEmails);
                }
                let newEmailsOpRes = await sendpulse.addEmails(mainAddressBook.id, emails);
                console.log('NEW EMAILS:');
                console.log(newEmailsOpRes);
                if (newEmailsOpRes.result) {
                    setTimeout(async () => {
                        let campaign = await sendpulse.createCampaign(
                            'OWU',
                            'nlutsik1@gmail.com',
                            'OWU',
                            text,
                            mainAddressBook.id
                        );
                        console.log('CAMPAIGN');
                        console.log(campaign);
                        if (campaign.id) {
                            res.json({ok: true});
                        } else {
                            next(new ControllerError(campaign.message, 500, 'Sending controller'))
                        }

                    }, 3000);
                }
            } else {
                next(new ControllerError(mainAddressBook.message, 500, 'Sending controller'))
            }
        } else {
            next(new ControllerError('Missed required parameters', 400, 'Sending controller'));
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Sending controller'));
    }
};

module.exports = controller;
