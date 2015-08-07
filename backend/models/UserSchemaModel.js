var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    authDate: Date,
    things: Schema.Types.Mixed,
    commands: Schema.Types.Mixed
}));