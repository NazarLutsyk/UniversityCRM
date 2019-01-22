let router = require('express').Router();
let controllers = require('../сontrollers');

router.post('/sms', controllers.sending.smsSending);
router.post('/mail', controllers.sending.emailSending);

module.exports = router;