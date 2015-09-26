angular.module('RrAppVoiceCtrl', [])
    .controller('voiceCtrl', function ($scope, $localStorage, restService) {
        var _this = $scope;

        _this.execute = function(){
            restService.executeVoiceCommand("switch on", "strob").then(function(d){//make interface and pass to thingCtrl
                console.log(d.data);
            });
        }
})
