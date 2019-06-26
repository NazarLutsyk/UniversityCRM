let controllers = {};

controllers.application = require('./application-controller');
controllers.audiocall = require('./audiocall-controller');
controllers.client = require('./client-controller');
controllers.clientStatus = require('./client-status-controller');
controllers.comment = require('./comment-controller');
controllers.contract = require('./contract-controller');
controllers.course = require('./course-controller');
controllers.group = require('./group-controller');
controllers.lesson = require('./lesson-controller');
controllers.payment = require('./payment-controller');
controllers.report = require('./report-controller');
controllers.source = require('./source-controller');
controllers.task = require('./task-controller');
controllers.city = require('./city-controller');
controllers.manager = require('./manager-controller');
controllers.eapplication = require('./eapplication-controller');
controllers.role = require('./role-controller');
controllers.auth = require('./auth-controller');
controllers.statistic = require('./statistic-controller');
controllers.file = require('./file-controller');
controllers.sending = require('./sending-controller');
controllers.social = require('./social-controller');
controllers.competitor = require('./competitor-controller');
controllers.competitorApplication = require('./competitor-application-controller');
controllers.rating = require('./rating-controller');
controllers.appByEapp = require('./app-by-eapp-controller');

module.exports = controllers;
