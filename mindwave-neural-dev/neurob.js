var _ = require('lodash');
var pos = require('node-pos').partsOfSpeech;
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

var initClassifier = function(classifier){
    //todo get classifier
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




setCommand("open window", "action1", classifier);
setCommand("open door", "action2", classifier);
setCommand("close door", "action2", classifier);
setCommand("close window", "action1", classifier);

console.log("command: " + getCommand("door open"));

var wordnet = new natural.WordNet();

/*
toRecognize.forEach(function (w) {
    wordnet.lookup(w, function (results) {
        results.forEach(function (result) {
            console.log('------------------------------------');
            // console.log(result.synsetOffset);
            console.log(result.pos);
            console.log(result.lemma);
            //console.log(result.synonyms);
            //console.log(result.gloss);
        });
    });
});*/