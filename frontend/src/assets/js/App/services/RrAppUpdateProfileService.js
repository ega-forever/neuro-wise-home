angular.module('RrAppUpdateProfileService', [])
    .factory('updateProfileService', function ($q) {

        var deferred = $q.defer();


        return {
            getDeferred: function(){
                return deferred;
            },
            getPromise: function() {
                return deferred.promise;
            }
        };

    })