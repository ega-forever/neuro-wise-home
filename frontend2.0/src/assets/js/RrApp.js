(function(angular, React) {
    angular.module('RrApp', [ 'ngStorage', 'RrAppThingsCtrl', 'JsxFactory', 'RrAppRestService',
        'RrAppAuthCtrl', 'RrAppWNetCtrl', 'RrAppVoiceCtrl', 'RrAppVoiceStorageService', 'RrAppSocketService']);
})(angular, React);