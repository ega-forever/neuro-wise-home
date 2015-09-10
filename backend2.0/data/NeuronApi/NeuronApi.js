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

            var tokenizer = new natural.WordTokenizer();
            var toRecognize = [];
            var saveDoc = function (err, res) {


                if (err) {
                    deferred.resolve(null);
                }

                res.classifier = th.classifier;
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


            if (_.result(_.find(th.classifier, {action: thing + " - " + command}), 'action') == null) {

                console.log('new');

                th.classifier.push({pattern: toRecognize.join(' '), action: thing + " - " + command});
                neuron.findOne({_id: th._id}, saveDoc);

            } else {
                deferred.resolve(null);
            }

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
            //console.log('step2');
            console.log(result.classifier);

            //result.classifier = natural.BayesClassifier.restore(JSON.parse(result.classifier));
            var classifierModel = new natural.BayesClassifier();
            result.classifier.forEach(function (item) {
                console.log("item: " + item.pattern);
                classifierModel.addDocument(item.pattern, item.action);
            });



            classifierModel.train();
           // classifierModel.on('trainedWithDocument', function (obj) {
             //   console.log(obj);
                var cl = classifierModel.getClassifications(phrase);
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


                var s = b ? classifierModel.classify(phrase) : null;
                console.log(s);
                lastDeffered.resolve(s);

        }, function (err) {
            lastDeffered.resolve(null);
        });

    return lastDeffered.promise;

}

var getCommandsList = function () {

    var deffered = q.defer();
    neuron.find({point: {$ne: null}}).exec().then(function (data) {
        console.log(data);
        deffered.resolve(data);
    }, function (err) {
        if (err) {
            deffered.resolve([]);
        }
    });

    return deffered.promise;
}

var modifyCommand = function (command) {
    console.log('step1');
    var deferred = q.defer();
    neuron.findOne({_id: command._id}).exec().then(function (data) {
        console.log('step2');
        data.classifier = command.classifier;
        data.save(function (err) {
            console.log('step3');
            if (err) {
                deferred.resolve('err');
            } else {
                deferred.resolve('ok');
            }
        });
    }, function (err) {
        if (err) {
            deferred.resolve('err');
        }
    });

    return deferred.promise;
}

//todo thing could be inited in configure interface only after add command
//setCommand("mega demo", 'toggle', 'demo').then(function () {
//    console.log('step2');
//      getCommand("turn on led").then(function (action) {
  //       console.log("action:" + action);
  //   });
//});


module.exports.setCommand = setCommand;
module.exports.getCommand = getCommand;
module.exports.modifyCommand = modifyCommand;
module.exports.getCommandsList = getCommandsList;