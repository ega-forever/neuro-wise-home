var CtrlThings = require('../../controllers/CtrlThings');
var CtrlAuth = require('../../controllers/CtrlAuth');

var get = function (req, res) {
    CtrlAuth.userAuthCtrlCheker(req.headers['x-access-token']).then(function (user) {
        if (user != null && user.id != null) {
            CtrlThings.get(user).then(function (d) {
                res.send(d);
            })
        } else {
            res.send([]);
        }

    });

};

var set = function (req, res) {

    CtrlAuth.userAuthCtrlCheker(req.headers['x-access-token']).then(function (user) {

        if (user != null && user.id != null) {
            CtrlThings.set(user, req.body.thing, req.body.option).then(function (a) {
                res.send(a);
            });
        } else {
            res.send([]);
        }
    });
};


module.exports.get = get;
module.exports.set = set;