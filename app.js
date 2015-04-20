
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, X-XSRF-TOKEN');
	next();
};



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var about = require('./routes/about');
app.get('/about', about.about);

var map = require('./routes/map');
app.get('/map', map.map);

var arr = require('./routes/arryoutube');
app.get('/arryoutube', arr.displaystats);



var graph = require('./routes/graph');
app.get('/graph', graph.graph);

var dataload = require('./routes/dataload');
app.get('/dataload', dataload.dataload);
app.get('/dataload/:id', dataload.findById);
app.post('/append/:id', dataload.appendById);

var info = require('./routes/info');
app.get('/info', info.info);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
