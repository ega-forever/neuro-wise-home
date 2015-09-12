var User = require('../models/UserSchemaModel');
var thingsApi = require('../data/thingsApi/thingsApi');
var ctrlAuth = require('../controllers/CtrlAuth');
var q = require('q');
var _ = require('lodash');
var io = require('socket.io');

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
                data.things = data.things.map(function (i) {
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

var initIo = function (cylon, cylonConfig, ioConfig) {

    cylon.api('socketio', cylonConfig);
    io = io(ioConfig.port);
    console.log('started io..');
    thingsIo(cylon, io);
    return io;
}

var thingsIo = function (cylon, io) {
    ctrlAuth.socketAuth(io).then(function(user){
        console.log('in thingsIo: ' + user);
        user.things.forEach(function(t){

            var thingAccessor = new thingStateFactory(t);
            thingAccessor.set = function(_this, option){

                _.isObject(t.state) ? t.state[option.option] = option.value : t.state = {},t.state[option.option] = option.value;
                setThings(user, t, "update").then(function(d){
                    console.log("updated");
                    _this.emit('change', {state: d});
                });
            };

            var thing = thingsApi.thingsLogic(thingAccessor, cylon);
            thing.start();
           });
    });
}


var thingStateFactory = function(d){
    var data = d;
    this.get = function(param){return data[param] == null ? {} : data[param]};
    this.set = function(){/*to override*/};
}

module.exports.set = setThings;
module.exports.get = getThings;
module.exports.initIo = initIo;