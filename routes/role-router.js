let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.role.getAll);

module.exports = router;