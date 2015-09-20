var CtrlVoice = require('../../controllers/CtrlVoice');
var CtrlAuth = require('../../controllers/CtrlAuth');

var execute = function (req, res) {
    CtrlAuth.userAuthCtrlCheker(req.headers['x-access-token']).then(function (user) {

        CtrlVoice.executeVoiceCommand(user, req.query.command).then(function (d) {

            res.send(JSON.stringify(d));
        })

    });

};

module.exports.execute = execute;
