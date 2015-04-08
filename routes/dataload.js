

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('youtube', server);
	
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'youtube_db' database");
        db.collection('video', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'video' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.dataload = function(req, res){
	res.render('dataload', { title: 'Data Load !!!' });
};


exports.findById = function(req, res) {
    var id = req.params.id;
    //console.log('Mongo ID: ' + mongoid);
    console.log('Retrieving video: ' + id);
    db.collection('video', function(err, collection) {
    	if(err) {
    		console.log("Something is wrong" + err);
    		res.send(400);
    	}
    	collection.findOne({_id:id}, function(err, item) {
    		if(err) res.send(401);
            res.send(item);
        });
    });
};


/*--------------------------------------------------------------------------------------------------------------------*/
//Populate database with sample data -- Only used once: the first time the application is started.
//You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

 var video = [
 {
	 _id: "VVoO9cdk5Eo",
     title: "OK Kanmani - Kaara Aattakkaara Lyric Video | A.R. Rahman, Mani Ratnam",
     average: 4.9146247,
     numRaters : 2530,
     viewCount : 241908,
     url : "https://www.youtube.com/watch?v=VVoO9cdk5Eo"
 }];

 db.collection('video', function(err, collection) {
     collection.insert(video, {safe:true}, function(err, result) {});
 });

};

