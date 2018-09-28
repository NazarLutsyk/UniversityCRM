let controllers = {};

controllers.application = require('./application-controller');
controllers.audiocall = require('./audiocall-controller');
controllers.client = require('./client-controller');
controllers.comment = require('./comment-controller');
controllers.contract = require('./contract-controller');
controllers.course = require('./course-controller');
controllers.group = require('./group-controller');
controllers.lesson = require('./lesson-controller');
controllers.payment = require('./payment-controller');
controllers.source = require('./source-controller');
controllers.task = require('./task-controller');

module.exports = controllers;