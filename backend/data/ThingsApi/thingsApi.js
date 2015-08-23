var Cylon = require('cylon');
var User = require('../../models/UserSchemaModel');
var AuthConfig = require('../../config/AuthConfig');
var jwt = require('jsonwebtoken');

var thingsLogic = function (proto, infoProto) {

    var things = {

        led: function () {
            return Cylon.robot({
                  name: infoProto.token.toLowerCase(),
                thingType: 'led',
                events: ['turned_on', 'turned_off', 'grid', 'toggle'],
                work: function () {
                    after((1).second(), function () {
                        console.log("Hello, led!");
                    });
                },
                commands: function () {
                    return {
                        toggle: this.toggle,
                        grid: this.grid
                    };
                },
                toggle: function (data) {

                    console.log('led toggle');

                    if (data.token == null)
                        return;

                    var userDecoded = jwt.decode(data.token, AuthConfig.config.secret);

                    console.log("validation");
                    if (infoProto.toggleState) {
                        infoProto.toggleState = false;
                        this.emit('turned_off', {data: infoProto.name + ' turned off'});
                    } else {
                        infoProto.toggleState = true;
                        this.emit('turned_on', {data: infoProto.name + ' turned on'});
                    }


                    User.findOne({
                        name: userDecoded.username, authDate: userDecoded.authDate
                    }, function (err, user) {

                        for (var m = 0; m < user.things.length; m++) {
                            if (user.things[m].id == infoProto.id) {
                                user.things[m].toggleState = infoProto.toggleState;
                            }
                        }
                        User.update({
                            name: userDecoded.username,
                            authDate: userDecoded.authDate
                        }, {things: user.things}, {multi: true}, function (err, numberAffected) {
                        });
                    });

                },
                grid: function () {
                    console.log("grid for led");
                    this.emit("grid", infoProto)
                },


                info: infoProto

            })
        },

        demo: function () {
            return Cylon.robot({
                 name: infoProto.token.toLowerCase(),
                thingType: 'demo',
                events: ['toggle',  'grid'],
                work: function () {
                    after((1).second(), function () {
                        console.log("Hello, demo!");
                    });
                },
                commands: function () {
                    return {
                        toggle: this.toggle,
                        grid: this.grid
                    };
                },
                toggle: function (data) {
                    console.log('demo');

                    if (data.token == null)
                        return;


                    this.emit('ping', {data: 'touched'});

                },
                grid: function () {
                    this.emit("grid", infoProto)
                },


                info: infoProto

            })
        }
    }


    return things[proto]();
}


module.exports.thingsLogic = thingsLogic;