let sendpulse = require('sendpulse-api');

let ControllerError = require('../errors/ControllerError');
let SEND_PULSE_CONFIG = require('../config/send-pulse');

let controller = {};

controller.smsSending = async function (req, res, next) {
    try {
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Sending controller'));
    }
};

controller.emailSending = async function (req, res, next) {
    try {
        const {text, emails} = req.body;
        sendpulse.init(
            SEND_PULSE_CONFIG.API_USER_ID,
            SEND_PULSE_CONFIG.API_SECRET,
            SEND_PULSE_CONFIG.TOKEN_STORAGE,
            (token) => {
                const tempAddressBookName = 'xxx';
                console.log(token);

                sendpulse.createAddressBook((data) => {
                    console.log(data);

                    const bookId = data.id;

                    if (bookId) {
                        sendpulse.addEmails((...addEmailsRes) => {
                            console.log(addEmailsRes);

                            setTimeout(() => {

                                sendpulse.createCampaign((...createCampaignRes) => {
                                        console.log(createCampaignRes);
                                        sendpulse.getCampaignInfo((...campaignInfoRes) => {
                                            console.log(campaignInfoRes);
                                        },createCampaignRes.id)
                                        // sendpulse.removeAddressBook((...removeAddressBookRes) => {
                                        //     console.log(removeAddressBookRes);
                                        // }, bookId);
                                    },
                                    'Okten',
                                    'nlutsik1@gmail.com',
                                    'OWU',
                                    message,
                                    bookId
                                )
                            }, 5000);


                        }, bookId, emails)
                    }
                }, tempAddressBookName)
            }
        )
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Sending controller'));
    }
};

module.exports = controller;