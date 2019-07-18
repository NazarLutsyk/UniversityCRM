let router = require('express').Router();
let controllers = require('../сontrollers');
let guard = require('node-auth-guard');
let ROLES = require('../config/roles');

router.route('/')
    .get(controllers.paymentStatus.getAll)
    .post(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.paymentStatus.create);

router.route('/:id')
    .get(controllers.paymentStatus.getById)
    .put(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.paymentStatus.update)
    .delete(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.paymentStatus.remove);

module.exports = router;
