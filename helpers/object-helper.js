let _ = require('lodash');
let helper = {};

helper.clean = function (target, fields) {
    if (target && fields && fields.length > 0) {
        for (const field of fields) {
            if (_.has(target, field)) {
                delete target[field];
            }
        }
        return target;
    } else {
        return target;
    }
};

helper.has = function (target, fields) {
    if (target && fields && fields.length > 0) {
        for (const field of fields) {
            if (!_.has(target, field)) {
                return false;
            }
        }
        return true;
    } else {
        return target;
    }
};

module.exports = helper;
