var bodyParser   = require('body-parser');
var cors = require('cors');

var config = function (app,  restThings, restAuth, restVoiceCommand) {
//in case back and front are not on same port
    app.all('*', function (req, res, next) {
        // add details of what is allowed in HTTP request headers to the response headers
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Credentials', false);
        res.header('Access-Control-Max-Age', '86400');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        // the next() function continues execution and will move onto the requested URL/URI
        next();
    });


    app.set('port', process.env.PORT || 9000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(bodyParser.json()); // get information from html forms
    app.use(bodyParser.urlencoded({extended: true}));


    //our routes
    app.post('/rest-things', restThings.fetch);
    app.post('/rest-things-connected', restThings.fetchConnected);
    app.post('/rest-things-add', restThings.add);
    app.post('/rest-things-remove', restThings.remove);
    app.post('/rest-voice-control', restVoiceCommand.execute);

    app.post('/authenticate', restAuth.auth);

//our options to method converter
    app.options('/authenticate', cors());//todo remove in future
    //app.options('/api/users', cors());//todo remove in future

}

module.exports.configure = config;