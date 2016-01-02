angular.module('RrAppSettingsCtrl', [])
    .controller('settingsCtrl', function (JsxSettingsFactory, $scope, $localStorage, restService) {
        var _this = $scope;

        if ($localStorage.token != null) {
            JsxSettingsFactory.SettingsRender({name: $localStorage.username, text: ""}, _this);
        }

        _this.change = function(uname, pass){
            restService.updateAuth(uname, pass).then(function(d){

                if(d.data.success){
                     $localStorage.$reset();
                       location.reload();
                    return;
                }

                JsxSettingsFactory.SettingsRender({name: $localStorage.username, text: d.data.message}, _this);

            });
        }

    });