var _ = require('lodash');
var natural = require('natural');
var neuron = require('../../models/NeuronSchemaModel');
var q = require('q');


var setCommand = function (phrase, command, thing) {


    var deferred = q.defer();

    neuron.findOneAndUpdate(
        {_point: thing},
        {"$setOnInsert": {point: thing}},
        {new: true, upsert: true}
    ).exec().then(function (th) {

            console.log('step0');
            th.classifier = natural.BayesClassifier.restore(JSON.parse(th.classifier));

            var tokenizer = new natural.WordTokenizer();
            var toRecognize = [];
            var saveDoc = function (err, res) {

                console.log("res");
                //console.log(res);
                var returnFromCallable = typeof res.classifier.getClassifications == 'function';
                console.log(returnFromCallable);
                if (err) {
                    deferred.resolve(null);
                }

                res.classifier = JSON.stringify(th.classifier);
                res.save(function (e) {
                    if (e) {
                        deferred.resolve(null);
                    }
                    deferred.resolve(th);
                });

            };


            tokenizer.tokenize(phrase).forEach(function (w) {
                toRecognize.push(natural.PorterStemmer.stem(w));
            });


            if (th.classifier != null && _.result(_.find(th.classifier.docs, {label: thing + " - " + command}), 'label') == null) {
                console.log('new');
                th.classifier.events.on('trainedWithDocument', function (obj) {
                    console.log(obj);
                    neuron.findOne({_id: th._id}, saveDoc);
                });
                th.classifier.addDocument(toRecognize.join(' '), thing + " - " + command);
                th.classifier.train();
            } else {
                console.log('not new');
                neuron.findOne({_id: th._id}, saveDoc);
            }

            //  var cl = th.classifier.getClassifications(phrase);
            //  console.log("cl: " + cl)

            return th;
        });

    return deferred.promise;
}

var getCommand = function (phrase) {

    var lastDeffered = q.defer();

    neuron.findOne(
        {"point": {"$in": _.words(phrase)}}
    ).exec().then(function (result) {
            if (result == null) {
                lastDeffered.resolve(null);
            }
            if (result != null && result.classifier != null) {
                console.log(result.classifier.docs);

                result.classifier = natural.BayesClassifier.restore(JSON.parse(result.classifier));


                console.log(result.classifier.classify(phrase));
                console.log("step1");

                var returnFromCallable = typeof result.classifier.getClassifications == 'function';
                console.log(returnFromCallable);


                var cl = result.classifier.getClassifications(phrase);
                console.log("cl: " + cl)
                var b = false;
                if (cl.length == 1)
                    b = true;
                for (var n = 1; n < cl.length; cl++) {
                    if (cl[n - 1].value != cl[n].value) {
                        b = true;
                        n = cl.length - 1;
                    }
                }


                var s = b ? result.classifier.classify(phrase) : null;
                console.log(s);

                lastDeffered.resolve(s);

            }
        }, function (err) {
            lastDeffered.resolve(null);
        });

    return lastDeffered.promise;

}

var getCommandsList = function(){

    var deffered = q.defer();
    neuron.find({point: {$ne: null}}).exec().then(function(data){
        console.log(data);
        deffered.resolve(data);
    }, function(err){
       if(err){
           deffered.resolve([]);
       }
    });

return deffered.promise;
}

var modifyCommand = function(command){
    console.log('step1');
    var deferred = q.defer();
    neuron.findOne({_id: command._id}).exec().then(function(data){
        console.log('step2');
        data.classifier = command.classifier;
        data.save(function(err){
            console.log('step3');
            if(err){
                deferred.resolve('err');
            }else{
                deferred.resolve('ok');
            }
        });
    }, function(err){
        if(err){
            deferred.resolve('err');
        }
    });

    return deferred.promise;
}
/*
setCommand("super led", 'toggle', 'led').then(function () {
    console.log('step2');
    getCommand("turn on led").then(function (action) {
        console.log("action:" + action);
    });
});
*/


module.exports.setCommand = setCommand;
module.exports.getCommand = getCommand;
module.exports.modifyCommand = modifyCommand;
module.exports.getCommandsList = getCommandsList;