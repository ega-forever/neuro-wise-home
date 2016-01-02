angular.module('RrAppAuthCtrl', [])
    .controller('authCtrl', function (JsxAuthFactory, $scope, restService, $localStorage, socketService, JsxThingsFactory, $controller) {
        var _this = $scope;

        _this.storage = $localStorage;
        _this.login = function (username, password) {
            restService.auth(username, password).then(function (d) {
                if(!d.data.success){
                   return JsxAuthFactory.LoginRender({text: d.data.message}, _this);
                }
                $localStorage.token = d.data.token;
                $localStorage.username = d.data.username;
                JsxAuthFactory.LogoutRender(d.data, _this);
                socketService.getAuthIo().emit('authIo', {token: $localStorage.token});
                var ns = $scope.$new();
                $controller('menuCtrl',{$scope : ns });
                ns.$destroy();
            });
        }

        _this.logout = function () {
            $localStorage.$reset();
            $scope.$apply();
            JsxAuthFactory.LoginRender({}, _this);
            JsxThingsFactory.thingsRender([], _this);

        }


        return $localStorage.token != null && $localStorage.username != null ? JsxAuthFactory.LogoutRender({username: $localStorage.username}, _this)
            : JsxAuthFactory.LoginRender({}, _this);
    });