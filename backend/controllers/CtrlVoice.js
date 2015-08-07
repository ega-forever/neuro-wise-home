var Q = require('q');

var executeVoiceCommand = function (user, data) {

    return function () {
        var deferred = Q.defer();

        if (user.id == null) {
            deferred.resolve([]);
            return deferred.promise;
        }


        console.log("command: " + data);

        deferred.resolve('executed!');//todo resolve voice from neurob

        return deferred.promise;


    }();
}





module.exports.executeVoiceCommand = executeVoiceCommand;