let router = require('express').Router();
let controllers = require('../сontrollers');
let guard = require('node-auth-guard');
let ROLES = require('../config/roles');

router.route('/')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE), controllers.group.getAll)
    .post(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.group.create);

router.route('/phones/:id')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE), controllers.group.getNumbersByGroupId);

router.route('/emails/:id')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE), controllers.group.getEmailsByGroupId);

router.route('/:id')
    .get(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE), controllers.group.getById)
    .put(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.group.update)
    .delete(guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), controllers.group.remove);

module.exports = router;
