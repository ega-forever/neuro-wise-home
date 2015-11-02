angular.module('RrAppSettingsCtrl', [])
    .controller('settingsCtrl', function (JsxSettingsFactory, $scope, $localStorage, restService) {
        var _this = $scope;

        if ($localStorage.token != null) {
            JsxSettingsFactory.SettingsRender({name: $localStorage.username}, _this);
        }

        _this.change = function(uname, pass){
            restService.updateAuth(uname, pass).then(function(d){

                console.log(d);
                $localStorage.$reset();
                location.reload();
            });
        }

    });