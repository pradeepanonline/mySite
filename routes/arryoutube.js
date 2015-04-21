/**
 * Main Page for ARR Youtube
 */
"use strict";
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('youtube', server);

var ratingData = [];
var viewCountData = [];
var timeData = [];
var videoName = "";
	
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'youtube_db' database");
        db.collection('video', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'video' collection doesn't exist. Error !!...");
                process.exit();
            }
        });
    }
});

var roundNumber = function (number, digits) {
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
};


var getListByVideoId = function(videoid) {
	console.log('Video ID: ' + videoid);
	var query = {"_id" : videoid};

	//ratingData = [4, 4.5, 5, 4.75, 4.9];
	videoName = "Sattena Peithadhu";

	console.log('Retrieving video: ' + videoid);
	db.collection('video', function(err, collection) {
		collection.findOne({_id:videoid}, function(err, item) {
			console.log("Retrieved number of items : " + item.stats.length);
			ratingData = [];
			timeData = [];
			for(var i=2; i < 8; i++) {
				console.log("Pushing ratingData: " + item.stats[i].average);
				var roundedRating = roundNumber(item.stats[i].average, 3);
				console.log("Pushing rounded ratingData: " + roundedRating);

				ratingData.push (roundedRating);
				timeData.push(item.stats[i].timestamp);
			}
		});
	});
};

exports.displaystats = function(req, res) {
	var videoid = req.params.videoid;
	console.log("VideoId : " + videoid);
	getListByVideoId(videoid);
	res.render('arryoutube', {
		title : 'ARR Youtube Project',
		timeData : timeData,
		videoRatingData : ratingData,
		videoName : videoName
	});
};
