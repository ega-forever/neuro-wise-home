var nodeThinkGear = require('node-thinkgear');
var io = require('socket.io');
var CtrlAuth = require('./CtrlAuth');


var tgClient = nodeThinkGear.createClient({
    appName: 'My Great Application',
    appKey: '1234567890abcdef...'
});
var userAuth = null;

tgClient.on('data', function (data) {

    if (data.eSense)
        console.log(data.eSense);


    if (data.eSense.attention > 50 && data.eSense.meditation > 50 && data.eegPower.delta < 15000 && userAuth.id != null)
        io.of('/neuro').emit('trigger', {
            data: '!!!'
        });


});

//tgClient.connect();


var init = function (data) {
    io = io(data.port);
    io.of('/neuro').on('connection', function (socket) {
        socket.emit('auth');

        socket.on('auth', function (data) {
            CtrlAuth.userAuthCtrlCheker(data.token).then(function(user){
                userAuth = user;

                if (user.id == null) {
                    socket.disconnect();
                    console.log('left');
                }
            });



            console.log(data);
        });
    });




    //tgClient.connect();
}


module.exports.initNeuro = init;