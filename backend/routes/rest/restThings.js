var CtrlThings = require('../../controllers/CtrlThings');
var CtrlAuth = require('../../controllers/CtrlAuth');
var ThingsDataPorts = require('../../data/ThingsPorts/ThingsPorts');
var ThingsDataAdd = require('../../data/ThingsActions/ThingsAdd');
var ThingsDataRemove = require('../../data/ThingsActions/ThingsRemove');


var fetch = function (req, res) {
    CtrlAuth.userAuthCtrlCheker(req.body.token).then(function (user) {

        CtrlThings.ioThings(user).then(function (d) {
            var newData = [];
            for (var i = 0; i < d.length; i++)
                newData.push({"io": d[i].io, "thingType": d[i].controller.thingType, "id": d[i].controller.info.id});

            res.send(JSON.stringify(newData));
        })

    });

};


var fetchConnected = function (req, res) {
    CtrlAuth.userAuthCtrlCheker(req.body.token).then(function (user) {
        if (user.id != null)
            ThingsDataPorts.fetchList().then(function (a) {
                res.send(a);
            });

        if (user.id == null)
            res.send([]);
    });
};


var add = function (req, res) {
    CtrlAuth.userAuthCtrlCheker(req.body.token).then(function (user) {
        if (user.id != null)
            ThingsDataAdd.add(user, req.body.thing).then(function (a) {
                res.send(a);
            });

        if (user.id == null)
            res.send([]);
    });
};



var remove = function (req, res) {
    CtrlAuth.userAuthCtrlCheker(req.body.token).then(function (user) {
        if (user.id != null)
            ThingsDataRemove.add(user, req.body.thing).then(function (a) {
                res.send(a);
            });

        if (user.id == null)
            res.send([]);
    });
};


module.exports.fetch = fetch;
module.exports.fetchConnected = fetchConnected;
module.exports.add = add;
module.exports.remove = remove;