let router = require('express').Router();
let controllers = require('../сontrollers');
let guard = require('node-auth-guard');
let ROLES = require('../config/roles');

router.route('/')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE), controllers.source.getAll)
    .post(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.source.create);

router.route('/:id')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE), controllers.source.getById)
    .put(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.source.update)
    .delete(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.source.remove);

module.exports = router;