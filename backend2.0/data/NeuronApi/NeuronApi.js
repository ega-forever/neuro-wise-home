var _ = require('lodash');
var natural = require('natural');
var neuron = require('../../models/NeuronSchemaModel');
var q = require('q');
var wordnet = new natural.WordNet();


var setCommand = function (commands, thing) {

    var deferred = q.defer();

    if (commands == null || !_.isArray(commands) || thing == null) {
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
                console.log(res.classifier);
                res.save(function (e) {
                    if (e) {
                        deferred.resolve(null);
                    }
                    console.log('saved...');
                    deferred.resolve(th);
                });

            };
            var synonyms = function (w) {
                var deferred = q.defer();


                wordnet.lookup(w, function (results) {
                    console.log(results);

                    var n = _.chain(results).thru(function (a) {
                        var s = a == null || a.length < 1 || a[0].synonyms == null ? [] : a[0].synonyms;
                        console.log(s);
                        for (var i = 1; i < a.length; i++) {
                            if (a[i].pos == 'v')
                                s = _.merge(s, a[i].synonyms);
                        }
                        return s;
                    }).uniq().map(function(f){
                        return f.replace("_", " ");
                    }).value();

                    deferred.resolve(n);

                });
                return deferred.promise;
            }
            var modifier = function () {

                var deferred = q.defer();
                commands.forEach(function (i, s) {
                    tokenizer.tokenize(i.pattern).forEach(function (w) {
                        toRecognize.push(natural.PorterStemmer.stem(w));
                    });



                    synonyms(i.pattern).then(function (synonyms) {
                        var inQueue = s;
                        if (_.chain(th.classifier).find({action: i.action}).result('action').value() == null) {

                            console.log('new');
                            th.classifier.push({pattern: toRecognize.join(' '), action: i.action, synonyms: synonyms});

                        } else {
                            console.log('update');
                            console.log(th.classifier);
                            th.classifier.map(function (item) {
                                item.action == i.action ? (item.pattern = toRecognize.join(' '), item.synonyms = synonyms) : item;
                            });

                        }
                        if (inQueue == commands.length - 1) {
                            deferred.resolve(th);
                        }
                    });
                });
                return deferred.promise;
            }

            modifier().then(function (td) {
                neuron.findOne({_id: td._id}, saveDoc);
            });

            return th;
        });

    return deferred.promise;
}

var getCommand = function (thing, phrase) {

    var lastDeferred = q.defer();
    console.log('in get');

    if (thing == null || phrase == null) {
        lastDeferred.resolve([]);
        return lastDeferred.promise;
    }

    neuron.findOne(
        {"point": thing}
    ).exec().then(function (result) {

            if (result == null) {
                lastDeferred.resolve(null);
            }

            var classifierModel = new natural.BayesClassifier();
            result.classifier.forEach(function (item) {
                classifierModel.addDocument(item.pattern, item.action);
                if(item.synonyms != null &&  _.isArray(item.synonyms)){
                    item.synonyms.forEach(function(j){
                        classifierModel.addDocument(j, item.action);
                    });
                }
            });

            classifierModel.train();

            var cl = classifierModel.getClassifications(phrase);
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
            lastDeferred.resolve({trigger: s, thing: result.point});

        }, function (err) {
            lastDeferred.resolve(null);
        });

    return lastDeferred.promise;

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


module.exports.setCommand = setCommand;
module.exports.getCommand = getCommand;
module.exports.getCommandsList = getCommandsList;