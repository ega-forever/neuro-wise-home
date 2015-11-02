var authCtrl = require('../../controllers/CtrlAuth');
exports.auth = function (req, res, next) {
    authCtrl.userAuthCtrl(req).then(function (a) {
        res.json(a);
    });
}


exports.cauth = function (req, res) {

    authCtrl.userAuthCtrlCheker(req.body.headers['x-access-token']).then(function (user) {

        if (user != null && user.id != null && req.body.uname.length > 3 && req.body.pass.length > 3) {
            authCtrl.userCAuthCtrl(user, req.body.uname, req.body.pass).then(function (a) {
                res.send(a);
            });
        } else {
            res.send([]);
        }


    });
}