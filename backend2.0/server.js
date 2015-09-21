var express = require('express');
var cylon = require('cylon');
var restThings = require('./routes/rest/restThings');
var restAuth = require('./routes/rest/restUserAuth');
var restConfigure = require('./routes/rest/restConfigure');
var restVoiceCommand = require('./routes/rest/restVoiceCommand');
var restCommands = require('./routes/rest/restCommands');
var ctrlThings = require('./controllers/CtrlThings');
var ctrlNeuro = require('./controllers/CtrlNeuro');
var ExpressConfigure = require('./config/ExpressConfig');
var mongoose = require('mongoose');
var mongooseConfig = require('./config/MongoConfig');
var neuronApi = require('./data/NeuronApi/NeuronApi');
var app = express();


mongoose.connect(mongooseConfig.database);

ExpressConfigure.configure(app, restThings, restAuth, restVoiceCommand, restCommands);

ctrlThings.initIo(cylon, {
    host: '0.0.0.0',
    port: '9001'
}, {port: '9002'});

ctrlNeuro.initNeuro({port: '9003'});



app.listen(app.get('port'), function(){
    console.log('started listening...');
});


//demo purpose

var neuronModel = require('./models/NeuronSchemaModel');
//neuronModel.remove({}, function(err) {
//    console.log('collection removed')
//});

neuronApi.setCommand([{pattern: "open window", action: 'toggle'}], 'strob').then(function(s){
    console.log("s: " + s);
//    neuronApi.getCommand("led open window").then(function(d){console.log(d)});
});

/*
var userModel = require('./models/UserSchemaModel');
userModel.remove({}, function(err) {
    console.log('collection removed')
});

var user = new userModel({
    name: 'user',
    password: 123,
    authDate: new Date(),
    things: []
});
user.save();
*/
