let express = require('express');
let guard = require('node-auth-guard');
let path = require('path');
let ROLES = require('../config/roles');

let router = express.Router();

router.use(
    '/passports',
    guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE, ROLES.REVIEWER_ROLE),
    express.static(path.join(__dirname, '../public', 'upload', 'passports'))
);
router.use(
    '/contracts',
    guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE),
    express.static(path.join(__dirname, '../public', 'upload', 'contracts'))
);
router.use(
    '/audiocalls',
    guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE),
    express.static(path.join(__dirname, '../public', 'upload', 'audiocalls'))
);
router.use(
    '/payments',
    guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE),
    express.static(path.join(__dirname, '../public', 'upload', 'payments'))
);
router.use(
    '/phones',
    guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE),
    express.static(path.join(__dirname, '../public', 'upload', 'phones'))
);
router.use(
    '/emails',
    guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE, ROLES.TEACHER_ROLE),
    express.static(path.join(__dirname, '../public', 'upload', 'emails'))
);

module.exports = router;
