let LocalStrategy = require('passport-local');
let db = require('../../db/models');

exports.LocalSignIn = new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
}, async function (login, password, done) {
    try {
        let user = await db.manager.findOne({
            where: {
                login: login,
                password: password
            }
        });
        if (user) {
            done(null, user);
        } else {
            return done(null, false);
        }
    } catch (e) {
        return done(e);
    }
});