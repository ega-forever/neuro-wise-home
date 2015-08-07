var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;


var hopfield = new Architect.Hopfield(80);
var trainer = new Trainer(hopfield);
var ascii2bin = function(ascii)
{
    var bin = "00000000000000000000000000000000000000000000000000000000000000000000000000000000";
    for (var i = 0; i < ascii.length; i++)
    {
        var code = ascii.charCodeAt(i);
        bin += ('00000000' + code.toString(2)).slice(-8);
    }
    return bin.slice(-10 * 8).split('').reverse();
}

var doTrain = function(set){
    trainer.train(set, {
        iterations: 100,
        error: .5,
        rate: .05
    });
}


var arr = ['close', 'open', 'whale'];
var ob = {};
var toLearn = [];
for(var s = 0;s < arr.length;s++){
    ob[ascii2bin(arr[s]).join('')] = arr[s];

    console.log(arr[s]);
    toLearn.push(ascii2bin(arr[s]));


}

hopfield.learn(toLearn);


var word = 'clos';

//if(hopfield.feed(ascii2bin(word)).join('') in ob)
//console.log('inside');

// feed new patterns to the network and it will return the most similar to the ones it was trained to remember
//console.log(ob[hopfield.feed(ascii2bin(word)).join('')]);

var hopfield = new Architect.Hopfield(10) // create a network for 10-bit patterns

// teach the network two different patterns

var s = {};
s[ascii2bin('test').join('')] = 'test';
s[ascii2bin('demo').join('')] = 'demo';
hopfield.learn([
    ascii2bin('test'),
    ascii2bin('demo')
])

console.log(s);
// feed new patterns to the network and it will return the most similar to the ones it was trained to remember
console.log(hopfield.feed(ascii2bin('test')).join(''));
//hopfield.feed(ascii2bin('demo'));


