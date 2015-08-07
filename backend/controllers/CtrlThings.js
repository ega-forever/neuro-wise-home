var thingsApi = require('../data/ThingsApi/thingsApi.js');
//var dataThings = require('../data/dataThings.js');
var AuthConfig = require('../config/AuthConfig');
var User = require('../models/UserSchemaModel');
var jwt = require('jsonwebtoken');
var Q = require('q');

var getThings = [];

var Cylon = null;
var initCylon = function (c, host) {
    Cylon = c;
    //dataThings.dataThings = ioThings();
    Cylon.api('socketio',host);

}


var ioThings = function (user) {

    return function () {
        var deferred = Q.defer();

        if (user.id == null) {
            deferred.resolve([]);
            return deferred.promise;
        }


        var temp = [];
        for (var s = 0; s < user.things.length; s++) {
            console.log("thing: ");

            user.things[s].token = jwt.sign({
                thingName: user.things[s].name,
                initDate: new Date()
            }, AuthConfig.config.secret, {
                expiresInMinutes: 1440 // expires in 24 hours
            });

            user.things[s].controller = thingsApi.thingsLogic([user.things[s]['trigger']], user.things[s]).start();
          //  console.log('started!');
            user.things[s].io = "http://127.0.0.1:9001/api/robots/" + user.things[s].token.toLowerCase();
            temp.push(user.things[s]);
        }
        console.log('super');
        getThings = temp;
        deferred.resolve(temp);

        return deferred.promise;


    }();
}


module.exports.initCylon = initCylon;
module.exports.ioThings = ioThings;
module.exports.getThings = function(){return getThings};
