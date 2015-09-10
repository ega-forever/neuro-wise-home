var User = require('../models/UserSchemaModel');
var jwt = require('jsonwebtoken');
var AuthConfig = require('../config/AuthConfig');
var mongoose = require('mongoose');
var promise = new mongoose.Promise;
var Q = require('q');


var auth = function (req) {
    // find the
    return User.findOne({
        name: req.body.name
    }).exec().then(function (user) {

        if (!user) {
            return {success: false, message: 'Authentication failed. User not found.'};
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                return {success: false, message: 'Authentication failed. Wrong password.'};
            } else {

                // if user is found and password is right
                // create a token
                user.authDate = new Date();
                var token = jwt.sign({username: user.name, authDate: user.authDate}, AuthConfig.config.secret, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                user.save();
                return {
                    username: user.name,
                    success: true,
                    token: token
                };
            }

        }
        return '';
    });

}


var isAuth = function (token) {

    if (token == null) {
        return function () {
            var deferred = Q.defer();
            deferred.resolve([]);
            return deferred.promise;
        }();
    }

    var user = jwt.decode(token, AuthConfig.config.secret);


    if (user == null)
        return function () {
            var deferred = Q.defer();
            deferred.resolve([]);
            return deferred.promise;
        }();


    return User.findOne({
        name: user.username, authDate: user.authDate
    }).exec().then(function (user) {
        return user;
    });


}

module.exports.userAuthCtrl = auth;
module.exports.userAuthCtrlCheker = isAuth;
