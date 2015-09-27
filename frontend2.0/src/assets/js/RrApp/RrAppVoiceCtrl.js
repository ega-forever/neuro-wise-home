angular.module('RrAppVoiceCtrl', [])
    .controller('voiceCtrl', function ($scope, $localStorage, restService, voiceStorageService) {
        var _this = $scope;


        var wordList = [];

        var grammars = [{title: "Things", g:  {
            numStates: 1, start: 0, end: 0, transitions: []
        }}];


        _this.execute = function(){

            voiceStorageService.getThings().forEach(function(item){

                wordList = [];
                grammars[0].g.transitions = [];

                wordList.push([item.name.toUpperCase(), item.phoneme.replace('1', '').replace('0','')]);
               console.log(grammars[0].g);
                grammars[0].g.transitions.push({from: 0, to: 0, word: item.name.toUpperCase()});
            });

            console.log(wordList);
            console.log(grammars);
            voiceStorageService.getVoiceApi().init(wordList, grammars).then(function(d){
                console.log('d: ' + d);
            });

            restService.executeVoiceCommand("switch on", "strob").then(function(d){//make interface and pass to thingCtrl
                console.log(d.data);
            });
        }
})
