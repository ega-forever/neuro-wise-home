var authCtrl = require('../../controllers/CtrlAuth');
exports.auth = function (req, res, next) {

    //authCtrl.userAuthCtrl(req, next);

    authCtrl.userAuthCtrl(req).then(function (a) {
        res.json(a);
    });
}