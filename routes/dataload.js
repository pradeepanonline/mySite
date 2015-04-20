

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
    		if(err) {res.send(401);}
    		console.log("Sucessfully returning item");
            res.send(item);
        });
    });
};

exports.appendById = function(req, res) {
	var youtubeData = req.body;
	var youtubeId = req.params.id;
	var currTime = new Date();
	//var mmddyyyy = (currTime.getMonth() + 1) + "/" + currTime.getDate() + "/" + currTime.getFullYear();
	youtubeData.timestamp = currTime;
	console.log('Appending data for video: ' + JSON.stringify(youtubeData));
	db.collection('video', function(err, collection) {
        //try to update
        collection.findAndModify(
            {'_id':youtubeId},
            [['_id','asc']],
            {$addToSet: {"stats": youtubeData}},
            {new: true},
            function(err, newObject){
                if(err) {
                    console.warn(err.message);
                    res.send(400, "Failed to Add Stats");
                } else {
                console.log("Updated !! " + JSON.stringify(newObject));
                res.send(newObject);
            }
        });      
    });   
}


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the
// application is started.
//You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

 var currTime = new Date();
 var mmddyyyy = (currTime.getMonth() + 1) + "/" + currTime.getDate() + "/" + currTime.getFullYear();
 var video = [
 {
	 _id: "VVoO9cdk5Eo",
     title: "OK Kanmani - Kaara Aattakkaara Lyric Video | A.R. Rahman, Mani Ratnam",
     url : "https://www.youtube.com/watch?v=VVoO9cdk5Eo",
     stats : [
     {
			average : 4.0,
			numRaters : 1000,
			viewCount : 100000,
			timestamp: "4/08/2015"
     },
     {
    	average : 4.5,
		numRaters : 2000,
		viewCount : 200000,
		timestamp: "4/09/2015"
 	 }]
 }];

 db.collection('video', function(err, collection) {
     collection.insert(video, {safe:true}, function(err, result) {});
 });

};

