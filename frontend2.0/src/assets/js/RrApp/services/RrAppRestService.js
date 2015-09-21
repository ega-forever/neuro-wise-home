angular.module('RrAppRestService', [])
    .factory('restService', function ($http, $localStorage) {

        return {
            getThings: function () {
                {
                    return $http.get('http://localhost:9000/rest-things', {headers: {'x-access-token' : $localStorage.token}})
                        .success(function(data){
                            return data;
                    });
                }
            },
            auth: function (username, password) {
                {
                    return $http.post('http://localhost:9000/authenticate', {name: username, password: password})
                        .success(function (data) {
                            return data;
                        });
                }
            },
            updateVoiceCommand: function (voiceCommands, thing) {
                {
                    return $http.post('http://localhost:9000/rest-voice',  {headers: {'x-access-token' : $localStorage.token},
                        commands: voiceCommands, thing:thing})
                        .success(function (data) {
                            return data;
                        });
                }
            }
        };

    })