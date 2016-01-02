angular.module('RrAppVoiceCtrl', [])
    .controller('voiceCtrl', function ($scope, $localStorage, restService, voiceStorageService, socketService) {
        var _this = $scope;

        _this.visible = $localStorage.username != null && $localStorage.token != null;

        var socket = socketService.getAuthIo();

        var wordList = [];

        var grammars = [{
            title: "Things", g: {
                numStates: 1, start: 0, end: 0, transitions: []
            }
        }];

        var progressBar = document.querySelector("#progressBar");

        var isInTurn = false;

        _this.execute = function () {

            if(isInTurn){
                return;
            }
            var things = [];
            wordList = [];
            grammars[0].g.transitions = [];

            isInTurn = true;
            progressBar.style.display = "block";
            voiceStorageService.getThings().forEach(function (item) {

                things.push(item);
                console.log(item);

                wordList.push([item.name.toUpperCase(), item.phoneme.replace('1', '').replace('0', '')]);
                console.log(grammars[0].g);
                grammars[0].g.transitions.push({from: 0, to: 0, word: item.name.toUpperCase()});
            });


            voiceStorageService.getVoiceApi().init(wordList, grammars, progressBar).then(function (d) {
                console.log('d: ' + d);
                var recognition = new webkitSpeechRecognition();
                recognition.lang = "en";

                recognition.onresult = function (event) {
                    console.log(event.results[0][0].transcript);

                    restService.executeVoiceCommand(event.results[0][0].transcript, d.toLowerCase()).then(function (d) {
                        console.log(d.data);

                        var thing = _.chain(things).find({name: d.data.thing.toLowerCase()}).value();
                        console.log(thing);
                        thing.socketObj.io.once('change', function (d) {
                            socket.emit('authIo', {token: $localStorage.token});
                        });
                        thing.socketObj.io.emit(d.data.trigger);

                    });
                    isInTurn = false;
                }

                recognition.start();


            });

        }
    })

