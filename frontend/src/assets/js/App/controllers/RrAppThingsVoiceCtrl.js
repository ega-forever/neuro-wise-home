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

                    console.log(event.results[0][0].transcript.toLowerCase())

                    $http.post('http://localhost:9000/rest-voice-control', {
                        command: event.results[0][0].transcript.toLowerCase(),
                        token: $localStorage.token
                    })
                        .success(function (message) {
                            //alert(message);
                            $('.thingModal.voice').modal('hide');
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

        $('.thingModal.voice').on('shown.bs.modal', function (e) {
            self.record();
            self.$apply();
        })


        self.back = function (path) {
            $location.path(path);
        }

    });
