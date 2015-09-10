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


         neuronApi.getCommand(data).then(function(data) {

             if(data == null){
                 deferred.resolve([]);
             }

            console.log('label: ' + data);

            ctrlThings.getThings().map(function (t) {
                var m = data.split('-');
                if (t.trigger == m[0].trim()) {
                    console.log('inside');
                    console.log(m[1].trim());
                    t.controller[m[1].trim()]({token: token});
                }
            });


            deferred.resolve();
        });
        return deferred.promise;


    }();
}


module.exports.executeVoiceCommand = executeVoiceCommand;