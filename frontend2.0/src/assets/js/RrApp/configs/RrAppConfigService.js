angular.module('RrAppConfigService', [])
    .factory('configService', function () {

        return {
            ioAuth: '192.168.1.4:9002',
            ioThings: '192.168.1.4:9001',
            ioNeuro: '192.168.1.4:9003',
            restHost: '192.168.1.4:9000'
            };


    })