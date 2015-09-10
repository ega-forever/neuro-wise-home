var NeuronApi = require('../../data/NeuronApi/NeuronApi');
var CtrlAuth = require('../../controllers/CtrlAuth');

var get = function (req, res) {
    CtrlAuth.userAuthCtrlCheker(req.body.token).then(function (user) {

NeuronApi.getCommandsList().then(function(data){
            res.send(data);
        })
    });
};


var modify = function (req, res) {
    CtrlAuth.userAuthCtrlCheker(req.body.token).then(function (user) {

        NeuronApi.modifyCommand(req.body.command).then(function(data){
            res.send(data);
        })
    });
};

module.exports.getCommands = get;
module.exports.modifyCommand = modify;
