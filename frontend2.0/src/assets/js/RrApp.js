(function(angular, React) {
    angular.module('RrApp', [ 'ngStorage', 'RrAppThingsCtrl', 'JsxFactory', 'RrAppRestService',
        'RrAppAuthCtrl', 'RrAppWNetCtrl', 'RrAppVoiceCtrl', 'RrAppMenuCtrl', 'RrAppVoiceStorageService', 'RrAppSocketService']);
})(angular, React);