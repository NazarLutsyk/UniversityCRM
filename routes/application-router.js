let router = require('express').Router();
let controllers = require('../сontrollers');
let guard = require('node-auth-guard');
let ROLES = require('../config/roles');

router.route('/')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE),controllers.application.getAll)
    .post(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE),controllers.application.create);

router.route('/:id')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE),controllers.application.getById)
    .put(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE),controllers.application.update)
    .delete(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE),controllers.application.remove);

module.exports = router;