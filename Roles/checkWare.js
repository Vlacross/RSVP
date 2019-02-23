const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');

/*write express middleware here */

var levelOne = function(req, res, next) {
    let role = req.user.role;

    if(role !== 1 || 0) {
        console.log("level One Restriction: access denied!")
        return Promise.reject({message: 'Account does not hold eventAdmin privileges', reason: 'Unauthorized'})
    }
    next()
};

var levelTwo = function(req, res, next) {
    let role = req.user.role;

    if(role !== 0) {
        console.log("level Two Restriction: access denied!")
        return Promise.reject({message: 'Account does not hold masterAdmin privileges', reason: 'Unauthorized'})
    }
    next()
};




module.exports = { levelOne, levelTwo }