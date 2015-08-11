angular.module('RrAppConfigureCtrl', [])
    .controller('configureCtrl', function ($scope, NeuroService, updateProfileService, $localStorage) {

        var _this = $scope;
        var neuro = NeuroService.initChannel().neuro;

        neuro.on('payload', function(payload){
            payload.data.attention += "%";
            payload.data.meditation += "%";
            _this.data = payload.data;
            _this.$apply();

        });

    });