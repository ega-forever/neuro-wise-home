var _ = require('lodash');
var natural = require('natural');
var neuron = require('../../models/NeuronSchemaModel');
var q = require('q');
var wordnet = new natural.WordNet();
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

var setCommand = function (commands, thing) {

    var deferred = q.defer();

    if (commands == null || !_.isArray(commands) || thing == null) {
        deferred.resolve([]);
        return deferred.promise;
    }


    console.log("inside: ");
    console.log(commands);


    neuron.findOneAndUpdate(
        {_point: thing},
        {"$setOnInsert": {point: thing}},
        {new: true, upsert: true}
    ).exec().then(function (result) {

            console.log("!!@");
            _.forEach(commands, function (i) {


                wordnet.lookup(i.pattern, function (results) {

                    var n = _.chain(results).thru(function (a) {
                        var s = a == null || a.length < 1 || a[0].synonyms == null ? [] : a[0].synonyms;
                        console.log(s);
                        for (var i = 1; i < a.length; i++) {
                            if (a[i].pos == 'v')
                                s = _.merge(s, a[i].synonyms);
                        }
                        return s;
                    }).uniq().map(function (f) {
                        return f.replace("_", " ");
                    }).value();


                    _.chain(result.actions).find({actions: {action: i.action}}).thru(function (s) {
                        return !_.isArray(s) || s.length == 0 ? result.actions.push(_.merge(i, {synonyms: n})) : result.actions[result.indexOf(s)] = _.merge(i, {synonyms: n});
                    }).value();

                    client.index({
                        index: result.point,
                        type: "command",
                        id: i.action,
                        body: {
                            action: i.action,
                            synonyms: n,
                            patterns: i.pattern,
                            counter: 1
                        }
                    }, function (error, response) {
                        console.log(response);
                        console.log(error);
                    });


                    if (commands.indexOf(i) == commands.length - 1) {
                        console.log("!!");
                        console.log(result);
                        deferred.resolve(n);
                    }
                })
            });


        }, function (err) {
            deferred.resolve(err);

        });

    return deferred.promise;
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


var getCommand = function (thing, phrase) {

    var deferred = q.defer();

    client.search({
        index: thing,
        type: 'command',
        body: {
            query: {
                multi_match: {
                    fields: ["synonyms"],
                    query: phrase,
                    fuzziness: 2
                }
            }
        }
    }, function (error, response) {
        console.log(response.hits.hits.length);
        console.log(error);
        deferred.resolve({trigger: _.result(response.hits.hits[0], "_source.action", ""), thing: thing});
    });

    return deferred.promise;

}

module.exports.setCommand = setCommand;
module.exports.getCommand = getCommand;
module.exports.getCommandsList = getCommandsList;