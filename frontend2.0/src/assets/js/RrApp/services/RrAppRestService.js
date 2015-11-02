angular.module('RrAppRestService', [])
    .factory('restService', function ($http, $localStorage, configService) {

        return {
            getThings: function () {
                {
                    return $http.get('http://' + configService.restHost +'/rest-things', {headers: {'x-access-token' : $localStorage.token}})
                        .success(function(data){
                            return data;
                    });
                }
            },
            auth: function (username, password) {
                {
                    console.log(configService.restHost);
                    return $http.post('http://'+  configService.restHost +'/authenticate', {name: username, password: password})
                        .success(function (data) {
                            return data;
                        });
                }
            },
            updateVoiceCommand: function (voiceCommands, thing) {
                {
                    return $http.post('http://' + configService.restHost + '/rest-voice',  {headers: {'x-access-token' : $localStorage.token},
                        commands: voiceCommands, thing:thing})
                        .success(function (data) {
                            return data;
                        });
                }
            },
            executeVoiceCommand: function (voiceCommand, thing) {
                {
                    return $http.get('http://' + configService.restHost +'/rest-voice?thing=' + thing + "&command=" + voiceCommand ,
                        {headers: {'x-access-token' : $localStorage.token}})
                        .success(function (data) {
                            return data;
                        });
                }
            },

            updateAuth: function (uname, pass) {
                {
                    return $http.post('http://' + configService.restHost +'/rest-cauth',  {headers: {'x-access-token' : $localStorage.token},
                        uname: uname, pass:pass})
                        .success(function (data) {
                            return data;
                        });
                }
            }


        };

    })