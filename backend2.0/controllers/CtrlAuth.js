var User = require('../models/UserSchemaModel');
var jwt = require('jsonwebtoken');
var AuthConfig = require('../config/AuthConfig');
var mongoose = require('mongoose');
var promise = new mongoose.Promise;
var q = require('q');
var events = new require('events');


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


var changeAuth = function (user, newName, newPass) {
console.log('inside');
    var deferred = q.defer();
    user.name = newName;
    user.password = newPass;
    user.save(function (e) {
        if (e) {
            deferred.resolve(null);
        }
        console.log('saved...');
        deferred.resolve('ok');
    });

}

var isAuth = function (token) {

    if (token == null) {
        return function () {
            var deferred = q.defer();
            deferred.resolve([]);
            return deferred.promise;
        }();
    }

    var user = jwt.decode(token, AuthConfig.config.secret);


    if (user == null)
        return function () {
            var deferred = q.defer();
            deferred.resolve([]);
            return deferred.promise;
        }();


    return User.findOne({
        name: user.username, authDate: user.authDate
    }).exec().then(function (user) {
        return user;
    });


}


var getIdByToken = function (token) {
    return jwt.decode(token, AuthConfig.config.secret).id;
}

var socketAuth = function (io) {
    var deferred = q.defer();


    var eventEmitter = new events.EventEmitter();

    //eventEmitter.addListener("authed", function(){});

    deferred.resolve(eventEmitter);


    io.of('/auth').on('connection', function (socket) {
        socket.on('authIo', function (data) {
            if (data != null && data.token != null) {
                var user = isAuth(data.token);
                user.then(function(d){
                    return user == null ? eventEmitter.emit("authed", null)  : ( eventEmitter.emit("authed", d) , socket.emit('ok'));
                })
            } else {
                eventEmitter.emit("authed", null);
            }
        });
    });
    return deferred.promise;
}

module.exports.userAuthCtrl = auth;
module.exports.userCAuthCtrl = changeAuth;
module.exports.userAuthCtrlCheker = isAuth;
module.exports.socketAuth = socketAuth;
module.exports.getIdByToken = getIdByToken;
