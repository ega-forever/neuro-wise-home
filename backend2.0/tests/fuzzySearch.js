var elasticsearch = require('elasticsearch');
var _ = require('lodash');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

client.search({
    index: 'strobe',
    type: 'command',
    body: {
        query: {
            multi_match: {
                fields: ["synonyms"],
                query: "ridegggg",
                fuzziness: 2
            }
        }

    }
}, function (error, response) {
    console.log(response.hits.hits.length);
    console.log(error);
    console.log(_.result(response.hits.hits[0], "_source.action", ""))
});


/*
 client.search({
 index: 'strobe',
 type: 'command',
 query: {
 fuzzy: {
 synonyms:  "ride"
 }
 }
 }, function (error, response) {
 console.log(response);
 console.log(error);
 });
 */