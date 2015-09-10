var User = require('../../models/UserSchemaModel');
var q = require('q');
var lodash = require('lodash');

var add = function(user, thing){

    var deferred = q.defer();

    console.log("!!!22");

    User.findOne({
            name: user.name,
            authDate: user.authDate

        },function(err, user){

        console.log(user.things);
        var name = lodash.result(lodash.find(user.things, 'comName',  thing.comName), 'name');
        if(!name)
        return deferred.resolve("equipment " + thing.name + " not exists!");


        console.log("index: " + lodash.findLastIndex(user.things,'comName', thing.comName));

        lodash.pullAt(user.things, lodash.findLastIndex(user.things, { 'comName': thing.comName}));


        console.log(user.things);






        User.update({
            name: user.name,
            authDate: user.authDate
        },{ $pull: { "things" : { comName : thing.comName } }}, {multi: true}, function (err, numberAffected) {
            deferred.resolve(numberAffected == 0 ? err : "removed");
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