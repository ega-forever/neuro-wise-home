angular.module('RrAppConfig', ['ngRoute'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main/main.html',
                    controller: 'mainCtrl'
                })

                .when('/configure', {
                    templateUrl: 'views/configure/configure.html',
                    controller: 'configureCtrl'
                })

                .when('/things', {
                    templateUrl: 'views/things/things.html',
                    controller: 'thingsCtrl',
                    resolve: {
                        thingsData: ['fetchService', function(fetchService){return fetchService.getThings() }]
                    }
                })
        }])