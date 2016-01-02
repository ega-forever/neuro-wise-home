var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Neuron', new Schema({
    point: String,//get data by this key.For instance if "o" -> open is among classifier, where main object is thing (led)
    actions: {type: Schema.Types.Mixed, default: []}
}));