angular.module('RrAppConfigService', [])
    .factory('configService', function () {

        return {
            ioAuth: 'localhost:9002',
            ioThings: 'localhost:9001',
            ioNeuro: 'localhost:9003',
            restHost: 'localhost:9000'
            };


    })