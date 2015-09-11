angular.module('RrAppThingsCtrl', [])
    .controller('thingsCtrl', function (JsxThingsFactory, $scope, restService) {
        var _this = $scope;
        var data = [{name: 'super!!!', id: 1237}, {name: 'super2', id : 54}];//test

        _this.AttachThing = function(){
            alert('super');
        }

        JsxThingsFactory.thingsRender(data, _this);
    });