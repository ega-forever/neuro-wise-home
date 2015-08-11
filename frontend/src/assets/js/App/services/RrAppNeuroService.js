angular.module('RrAppNeuroService', [])
    .factory('NeuroService', function ($http, $localStorage) {


        var neuro =  io.connect('http://localhost:9002/neuro');
        var validated = false;
        neuro.on('auth', function(){
            neuro.emit('auth', {token: $localStorage.token});
        });

        return {
            initChannel: function () {
                {
                    if(!validated){
                        neuro.connect().emit('auth', {token: $localStorage.token});
                        validated = neuro.connected;
                    }
                    return {neuro: neuro};
                }
            },
            getChannel: function(){
                return neuro;
            }
        };

    })