let router = require('express').Router();
let controllers = require('../сontrollers');
let guard = require('node-auth-guard');
let ROLES = require('../config/roles');

router.route('/')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.payment.getAll)
    .post(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.payment.create);

router.route('/:id')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.payment.getById)
    .delete(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.payment.remove);

router.post('/:id/upload', controllers.payment.upload);

module.exports = router;