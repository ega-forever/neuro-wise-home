angular.module('RrAppSocketService', [])
    .factory('socketService', function () {

        return {
            getAuthIo: function () {
                {
                    return io('http://localhost:9002/auth');
                }
            },
            getThingIo: function (name) {
                {
                    return io('http://localhost:9001/api/robots/' + name);
                }
            }
        };

    })