angular.module('RrAppSocketService', [])
    .factory('socketService', function (configService) {

        return {
            getAuthIo: function () {
                {
                    return io('http://' + configService.ioAuth +'/auth');
                }
            },
            getThingIo: function (name) {
                {
                    return io('http://' + configService.ioThings +'/api/robots/' + name);
                }
            },
            getNeuroIo: function(){
                return io.connect('http://'+ configService.ioNeuro +'/neuro');
            }
        };

    })