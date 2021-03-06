//var Cylon = require('cylon');
var User = require('../../models/UserSchemaModel');
var AuthConfig = require('../../config/AuthConfig');
var jwt = require('jsonwebtoken');

var thingsLogic = function (proto, cylon) {

    var things = {

        led: function (data) {
            return cylon.robot({
                name: data.get('name'),
                //thingType: 'led',
                events: ['change'],
                work: function () {
                    after((1).second(), function () {
                        console.log("Hello, led!");
                    });
                },
                commands: function () {
                    return {
                        toggle: this.toggle
                    };
                },
                toggle: function () {
                    console.log('toggle: ' + data.get('state').toggleState);
                    console.log(data.get('state').toggleState);
                    if (data.get('state').toggleState) {
                        data.set(this, {option: 'toggleState', value: false});
                    } else {
                        data.set(this, {option: 'toggleState', value: true});
                    }
                    return 'toggled';
                }
            })
        },


        hue: function (data) {
            return cylon.robot({
                name: data.get('name'),
                //thingType: 'led',
                events: ['change'],
                work: function () {
                    after((1).second(), function () {
                        console.log("Hello, hue!");
                    });
                },
                commands: function () {
                    return {
                        toggle: this.toggle
                    };
                },
                toggle: function () {
                    console.log('toggle: ' + data.get('state').toggleState);
                    console.log(data.get('state').toggleState);
                    if (data.get('state').toggleState) {
                        data.set(this, {option: 'toggleState', value: false});
                    } else {
                        data.set(this, {option: 'toggleState', value: true});
                    }
                }
            })
        }

    }


    return new things[proto.get('type')](proto);
}


module.exports.thingsLogic = thingsLogic;