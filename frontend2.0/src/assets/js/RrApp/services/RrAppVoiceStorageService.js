angular.module('RrAppVoiceStorageService', [])
    .factory('voiceStorageService', function () {

        var _this = this;

        return {
            getThings: function () {
                return _.clone(_this.things);
            },
            setThings: function (things) {
                _this.things = things;
            },
            getVoiceApi: function(){
                return  new cmuApi();
            }
        }
    });