function cmuApi() {
    var recognizer, recorder, callbackManager, audioContext;

    function postRecognizerJob(message, callback) {
        var msg = message || {};
        if (callbackManager) msg.callbackId = callbackManager.add(callback);
        if (recognizer) recognizer.postMessage(msg);
    };

    function spawnWorker(workerURL, onReady) {
        recognizer = new Worker(workerURL);
        recognizer.onmessage = function (event) {
            onReady(recognizer);
        };
        recognizer.postMessage('');
    };


    var startRecording = function () {
        recorder.start("");
    };

    var stopRecording = function () {
        recorder.stop();
    };

    var feedGrammar = function (g, index, id) {
        if (id && (grammarIds.length > 0)) grammarIds[0].id = id.id;
        if (index < g.length) {
            grammarIds.unshift({title: g[index].title})
            postRecognizerJob({command: 'addGrammar', data: g[index].g}, function (id) {
                feedGrammar(g, index + 1, {id: id});
            });
        } else {
            startRecording();
        }
    };

    var initVoice = function (wordList, grammars) {
        var deferred = Q.defer();

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        window.URL = window.URL || window.webkitURL;
        audioContext = new AudioContext();


        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio: true}, function (stream) {


                var input = audioContext.createMediaStreamSource(stream);
                // Firefox hack https://support.mozilla.org/en-US/questions/984179
                window.firefox_audio_hack = input;
                var audioRecorderConfig = {
                    errorCallback: function (x) {
                    }
                };

                recorder = new AudioRecorder(input, audioRecorderConfig);

                console.log('!!!');
                callbackManager = new CallbackManager();
                spawnWorker("js/cmu/recognizer.js", function (worker) {
                    worker.onmessage = function (e) {
                        console.log(e.data);
                        if (e.data.hasOwnProperty('id')) {
                            var clb = callbackManager.get(e.data['id']);
                            var data = {};
                            if (e.data.hasOwnProperty('data')) {
                                data = e.data.data;
                            }
                            if (clb) {
                                clb(data)
                            }

                        }
                        if (e.data.hasOwnProperty('hyp')) {
                            if (e.data.hyp.split(" ").length > 1) {
                                console.log('resolved');
                                recorder.stop();
                                deferred.resolve(e.data.hyp.split(" ")[1]);

                            }

                        }
                        if (e.data.hasOwnProperty('status') && (e.data.status == "error")) {
                            console.log(e.data);
                        }
                    };
                    // Once the worker is fully loaded, we can call the initialize function

                    postRecognizerJob({command: 'initialize'}, function () {
                        if (recorder) recorder.consumers = [recognizer];
                        postRecognizerJob({command: 'addWords', data: wordList},
                            function () {
                                feedGrammar(grammars, 0);
                            });
                    });
                });

            }, function (e) {
                deferred.resolve('err');
            });
        } else {
            deferred.resolve('err');
        }


        return deferred.promise;
    };

    var grammarIds = [];

    return {
        init: initVoice,
        stop: stopRecording,
        start: startRecording
    };
}