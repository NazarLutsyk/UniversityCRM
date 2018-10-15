let validators = {};

validators.hasLetters = function (value){
    if (value.trim().length === 0){
        throw new Error('Cannot be empty!')
    }
};

module.exports = validators;