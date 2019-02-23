const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/*write express middleware here */

/*Allows eventAdmins and masterAdmin through */
var levelOne = function(req, res, next) {
    let role = req.user.role;

    if(role === 0) {
        return next()
    }

    if(role !== 1) {
        console.log("level One Restriction: access denied!", 'current role', role)
        return Promise.reject({message: 'This account does not hold eventAdmin privileges', reason: 'Unauthorized'})
    }
    console.log("lvl1-pass")
    next()
};

/*Allows only masterAdmins through */
var levelTwo = function(req, res, next) {
    let role = req.user.role;

    if(role !== 0) {
        console.log("level Two Restriction: access denied!", 'current role', role)
        return Promise.reject({message: 'This account does not hold masterAdmin privileges', reason: 'Unauthorized'})
    }
    console.log("lvl2-pass")
    next()
};




module.exports = { levelOne, levelTwo }