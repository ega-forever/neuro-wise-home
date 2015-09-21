var _ = require('lodash');
var natural = require('natural');
var neuron = require('../../models/NeuronSchemaModel');
var q = require('q');


var setCommand = function (commands, thing) {

    var deferred = q.defer();

    if(commands == null || !_.isArray(commands)  || thing == null){
        deferred.resolve([]);
        return deferred.promise;
    }
    neuron.findOneAndUpdate(
        {_point: thing},
        {"$setOnInsert": {point: thing}},
        {new: true, upsert: true}
    ).exec().then(function (th) {

            console.log('step0');

            var tokenizer = new natural.WordTokenizer();
            var toRecognize = [];
            var saveDoc = function (err, res) {


                console.log(res);
                if (err) {
                    deferred.resolve(null);
                }

                res.classifier = th.classifier;
                res.save(function (e) {
                    if (e) {
                        deferred.resolve(null);
                    }
                    console.log('saved...');
                    deferred.resolve(th);
                });

            };

            _.pull(th.classifier, null);

            commands.forEach(function (i) {
                tokenizer.tokenize(i.pattern).forEach(function (w) {
                    toRecognize.push(natural.PorterStemmer.stem(w));
                });


                if (_.chain(th.classifier).find({action: i.action}).result('action').value() == null) {
                    // if (_.result(_.find(th.classifier, ), 'action') == null) {

                    console.log('new');

                    th.classifier.push({pattern: toRecognize.join(' '), action: i.action});

                } else {
                    console.log('update');
                    console.log(th.classifier);
                    th.classifier = th.classifier.map(function (item) {
                        item.action == i.action ? item.pattern = toRecognize.join(' ') : item;
                    });

console.log('update2');
                }

            });

            console.log('update3');

            neuron.findOne({_id: th._id}, saveDoc);

            return th;
        });

    return deferred.promise;
}

var getCommand = function (phrase) {

    var lastDeffered = q.defer();
    console.log('in get');
    neuron.findOne(
        {"point": {"$in": _.words(phrase)}}
    ).exec().then(function (result) {
            console.log('result: ' + result);
            if (result == null) {
                lastDeffered.resolve(null);
            }

            var classifierModel = new natural.BayesClassifier();
            result.classifier.forEach(function (item) {
                console.log("item: " + item.pattern);
                classifierModel.addDocument(item.pattern, item.action);
            });


            classifierModel.train();

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
            lastDeffered.resolve({trigger: s, thing: result.point});

        }, function (err) {
            lastDeffered.resolve(null);
        });

    return lastDeffered.promise;

}

var getCommandsList = function () {

    var deferred = q.defer();
    neuron.find({point: {$ne: null}}).exec().then(function (data) {
        deferred.resolve(data);
    }, function (err) {
        if (err) {
            deferred.resolve([]);
        }
    });

    return deferred.promise;
}
/*
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
 */
//todo thing could be inited in configure interface only after add command
//setCommand("mega demo", 'toggle', 'demo').then(function () {
//    console.log('step2');
//      getCommand("turn on led").then(function (action) {
//       console.log("action:" + action);
//   });
//});


module.exports.setCommand = setCommand;
module.exports.getCommand = getCommand;
//module.exports.modifyCommand = modifyCommand;
module.exports.getCommandsList = getCommandsList;