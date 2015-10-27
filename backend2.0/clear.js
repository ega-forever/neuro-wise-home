//demo purpose

var mongoose = require('mongoose');
var mongooseConfig = require('./config/MongoConfig');

mongoose.connect(mongooseConfig.database);


var neuronModel = require('./models/NeuronSchemaModel');
neuronModel.remove({}, function(err) {
    console.log('collection removed')
});




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

