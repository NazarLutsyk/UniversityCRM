let lib = {};

lib.buildSql = function(table, attributes = '*'){
    return `select ${attributes} from ${table}`;
};

module.exports = lib;