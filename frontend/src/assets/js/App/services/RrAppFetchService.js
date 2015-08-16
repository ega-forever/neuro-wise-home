angular.module('RrAppFetchService', [])
    .factory('fetchService', function ($http, $localStorage) {

        return {
            getThings: function () {
                {
                    return $http.post('http://localhost:9000/rest-things', {token: $localStorage.token})
                        .success(function(data){
                            return data;
                    });
                }

            },
            getConnectedThings: function () {

                return $http.post('http://localhost:9000/rest-things-connected', {token: $localStorage.token})
                    .success(function(data){
                        return data;
                    });
            },
            getCommands: function () {

                return $http.post('http://localhost:9000/rest-commands', {token: $localStorage.token})
                    .success(function(data){
                        return data;
                    });
            }
        };

    })