var CtrlVoice = require('../../controllers/CtrlVoice');
var CtrlAuth = require('../../controllers/CtrlAuth');

var execute = function (req, res) {
    CtrlAuth.userAuthCtrlCheker(req.headers['x-access-token']).then(function (user) {

        CtrlVoice.executeVoiceCommand(user, req.query.thing, req.query.command).then(function (d) {

            res.send(JSON.stringify(d));
        })

    });

};


var setVoiceCommand = function(req, res){

    CtrlAuth.userAuthCtrlCheker(req.body.headers['x-access-token']).then(function (user) {

        if (user != null && user.id != null) {
            CtrlVoice.setVoiceCommand(req.body.commands, req.body.thing).then(function (d) {
                res.send(JSON.stringify(d));
            });
        } else {
            res.send([]);
        }



    });

};

module.exports.execute = execute;
module.exports.set = setVoiceCommand;

