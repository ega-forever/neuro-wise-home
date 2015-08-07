angular.module('RrAppThingsVoiceCtrl', [])
    .controller('thingsVoiceCtrl', function ($scope, fetchService, updateProfileService, $http, $localStorage, $location, $route) {

        var self = $scope;

        self.isRecording = false;
        var recognition = new webkitSpeechRecognition();
        recognition.lang = "en-US";


        self.record = function () {
            self.isRecording = !self.isRecording;
            if (self.isRecording) {
                recognition.onresult = function (event) {

                    console.log(event.results[0][0].transcript)

                    $http.post('http://localhost:9000/rest-voice-control', {
                        command: event.results[0][0].transcript,
                        token: $localStorage.token
                    })
                        .success(function (message) {
                            alert(message);
                        });



                }
                recognition.onend = function() {
                    console.log("!!!");
                self.isRecording = false;
                    self.$apply();
                }
                recognition.start();
            } else {
                recognition.stop();
            }

        }










        self.back = function (path) {
            $location.path(path);
        }


    });
