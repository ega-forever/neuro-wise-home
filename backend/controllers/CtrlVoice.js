var Q = require('q');
var neuronApi = require('../data/NeuronApi/NeuronApi');
var ctrlThings = require('./CtrlThings');
var executeVoiceCommand = function (user, data, token) {


    return function () {
        var deferred = Q.defer();

        if (user == null || user.id == null) {
            deferred.resolve([]);
            return deferred.promise;
        }

        //neuronApi.classifier = user.commands == null ? neuronApi.classifier : user.commands;

       // console.log("command: " + data);

         neuronApi.getCommand(data).then(function(data) {


            console.log('label: ' + data);

            console.log(ctrlThings.getThings());
            ctrlThings.getThings().map(function (t) {
                var m = data.split('-');
                console.log('!!!');
                if (t.trigger == m[0].trim()) {
                    console.log('inside');
                    console.log(t.controller[m[1].trim()]);
                    t.controller[m[1].trim()]({token: token});
                }
            });


            deferred.resolve();
        });
        return deferred.promise;


    }();
}





module.exports.executeVoiceCommand = executeVoiceCommand;