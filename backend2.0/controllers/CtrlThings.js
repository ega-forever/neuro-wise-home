var User = require('../models/UserSchemaModel');
var q = require('q');
var _ = require('lodash');


var getThings = function (user) {
    var deferred = q.defer();
    User.findOne({_id: user.id}).exec().then(function (data) {

        deferred.resolve(data.things);

    }, function (err) {
        if (err) {
            deferred.resolve('err');
        }
    });

    return deferred.promise;
};

var setThings = function (user, thing, option) {
    var deferred = q.defer();
    if (thing == null || option == null) {
        deferred.resolve('no option or thing');
    }

    User.findOne({_id: user.id}).exec().then(function (data) {

        if (option == 'update') {

            data.things == null ? data.things = [] :
                data.things.map(function (i) {
                    return i.name == thing.name ? i = thing : i;
                });

        } else if (option == 'remove') {

            data.things = _.remove(data.things, function (n) {
                return n.name = thing.name;
            });

        } else if (option == 'add') {

            if (_.result(_.find(data.things, {name: thing.name}), 'name') == null) {
                data.things == null ? data.things = [thing] : data.things.push(thing);
            }

        } else {
            deferred.resolve('no option');
        }
        data.save(function (err) {
            if (err) {
                deferred.resolve('err');
            } else {
                deferred.resolve('ok');
            }
        });
    }, function (err) {
        if (err) {
            deferred.resolve('err');
        }
    });

    return deferred.promise;
}

module.exports.set = setThings;
module.exports.get = getThings;
