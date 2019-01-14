let router = require('express').Router();
let controllers = require('../сontrollers');
let guard = require('node-auth-guard');
let ROLES = require('../config/roles');

router.route('/')
    .get(controllers.client.getAll)
    .post(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.client.create);

router.route('/:id')
    .get(controllers.client.getById)
    .put(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.client.update)
    .delete(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.client.remove);

router.post('/:id/passport/upload', controllers.client.uploadPassport);

module.exports = router;