angular.module('RrAppAuthCtrl', [])
    .controller('authCtrl', function (JsxAuthFactory, $scope, restService, $localStorage) {
        var _this = $scope;

        _this.storage = $localStorage;
        _this.login = function(username, password){
            restService.auth(username, password).then(function(d){
                console.log(d.data);
                $localStorage.token = d.data.token;
                $localStorage.username = d.data.username;
                JsxAuthFactory.LogoutRender(d.data, _this);

            });
        }

        _this.logout = function(){
            //todo clear localstorage
            $localStorage.$reset();
            console.log($localStorage);
            $scope.$apply();
            JsxAuthFactory.LoginRender({}, _this);
        }



        return $localStorage.token != null && $localStorage.username != null ? JsxAuthFactory.LogoutRender({username: $localStorage.username}, _this)
            : JsxAuthFactory.LoginRender({}, _this);
    });