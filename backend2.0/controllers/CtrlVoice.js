var Q = require('q');
var neuronApi = require('../data/NeuronApi/NeuronApiS');
var ctrlThings = require('./CtrlThings');
var executeVoiceCommand = function (user, thing,  command) {

    console.log(user);
    return function () {
        var deferred = Q.defer();

        if (user == null || user.id == null) {
            deferred.resolve([]);
            return deferred.promise;
        }


        neuronApi.getCommand(thing, command).then(function (data) {

            if (data == null) {
                deferred.resolve([]);
            }

            deferred.resolve(data);
        });

        return deferred.promise;


    }();
}


var getVoiceCommands = function () {
    return neuronApi.getCommandsList();
}

var setVoiceCommand = function (actions, thing) {
    return neuronApi.setCommand(actions, thing);
}


module.exports.executeVoiceCommand = executeVoiceCommand;
module.exports.getVoiceCommands = getVoiceCommands;
module.exports.setVoiceCommand = setVoiceCommand;