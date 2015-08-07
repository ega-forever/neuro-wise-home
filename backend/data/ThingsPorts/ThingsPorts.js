var serialPort = require("serialport");
var vendors = require('./vendorList');
var lodash = require('lodash');
var Q = require('q');

var list = function () {

    return function () {
        var deferred = Q.defer();
        console.log('serial...');
        serialPort.list(function (err, ports) {

            ports = ports.map(function(port){
                return lodash._.merge(port, vendors.list[port.manufacturer]);
            });

            deferred.resolve(ports);
        });

        return deferred.promise;
    }();
}

module.exports.fetchList = list;