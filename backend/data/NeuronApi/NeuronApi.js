var _ = require('lodash');
//var pos = require('node-pos').partsOfSpeech;
var natural = require('natural');
var classifier = new natural.BayesClassifier();



var setCommand = function(phrase, command, classifier){

    var tokenizer = new natural.WordTokenizer();
    var toRecognize = [];


    tokenizer.tokenize(phrase).forEach(function (w) {
        toRecognize.push(natural.PorterStemmer.stem(w));
    });


    console.log(toRecognize.join(' '));

    classifier.addDocument(toRecognize.join(' '), command);
    classifier.train();

}

var getCommand = function(phrase){

    var cl = classifier.getClassifications(phrase);
    console.log(cl);
    var b = false;
    if(cl.length == 1)
        b = true;

    for (var n = 1; n < cl.length; cl++) {
        if (cl[n - 1].value != cl[n].value) {
            b = true;
            n = cl.length - 1;
        }
    }

    return b ? classifier.classify(phrase) : null;
}



setCommand("led on", 'led - toggle', classifier);
setCommand("turn on led",'led - toggle', classifier);
setCommand("led off", 'led - toggle', classifier);
setCommand("turn off led",'led - toggle', classifier);

console.log("command: " + getCommand("door open").thing);



module.exports.classifier = classifier;
module.exports.setCommand = setCommand;
module.exports.getCommand = getCommand;