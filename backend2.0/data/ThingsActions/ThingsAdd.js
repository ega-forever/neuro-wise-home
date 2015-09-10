var User = require('../../models/UserSchemaModel');
var q = require('q');
var lodash = require('lodash');

var add = function(user, thing){

    var deferred = q.defer();

    console.log("!!!");

    User.findOne({
            name: user.name,
            authDate: user.authDate

        },function(err, user){

        console.log(user.things);
        var name = lodash.result(lodash.find(user.things, 'comName',  thing.comName), 'name');
        if(name)
        return deferred.resolve("equipment " + name + " already exists!");



        User.update({
            name: user.name,
            authDate: user.authDate
        }, {$push: {things: thing}}, {multi: true}, function (err, numberAffected) {

            console.log("updated");
            deferred.resolve(numberAffected == 0 ? err : "updated");
        });

    });

/*
        {$push: {things: thing}}, {multi: true}, function (err, numberAffected) {
        console.log("updated");
            deferred.resolve(numberAffected == 0 ? err : "updated");
        });
        */
return deferred.promise
}

module.exports.add = add;