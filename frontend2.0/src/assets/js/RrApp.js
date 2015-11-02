(function(angular, React) {
    angular.module('RrApp', [ 'ngStorage', 'RrAppThingsCtrl', 'JsxFactory', 'RrAppRestService',
        'RrAppAuthCtrl', 'RrAppWNetCtrl', 'RrAppVoiceCtrl', 'RrAppMenuCtrl', 'RrAppSettingsCtrl',
        'RrAppVoiceStorageService', 'RrAppSocketService', 'RrAppConfigService']);
})(angular, React);