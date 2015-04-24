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
var timeData = [];
var numViewersData = [];
var videoName = "";
var statsList = [];


var rating2Data = [4.5, 4.6, 4.3, 4.8, 4.8];
var numViewers2Data = [60000, 65000, 67000, 69000, 72000];
var time2Data = ["04/01", "04/02", "04/03", "04/04", "04/05"];
var video2Name = "Theera";
	
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
    var roundedNum = Math.round(number * multiple) / multiple;
    return roundedNum;
};


var getListByVideoId = function(videoid) {
	console.log('Video ID: ' + videoid);
	var query = {"_id" : videoid};

	console.log('Retrieving video: ' + videoid);
	db.collection('video', function(err, collection) {
		collection.findOne({_id:videoid}, function(err, item) {
			console.log("Retrieved number of items : " + item.stats.length);
			videoName = item.title;
			console.log("videoName : " + videoName);
			ratingData = [];
			numViewersData = [];
			timeData = [];
			for(var i=0; i < item.stats.length; i++) {
				var numViewers = item.stats[i].viewCount;
				numViewersData.push (numViewers/1);
				console.log("Pushing numViewersData : " + numViewers);
				console.log("Pushing ratingData: " + item.stats[i].average);
				var roundedRating = roundNumber(item.stats[i].average, 3);
				console.log("Pushing rounded ratingData: " + roundedRating);
				ratingData.push (roundedRating);
				timeData.push(item.stats[i].timestamp);
			}
		});
	});
};

var getFullList = function(res) {
	console.log('Retrieving video list from db ...');
	statsList = [];
	db.collection('video',
			function(err, collection) {
				var cursor = db.collection('video').find();
				cursor
						.each(function(err, item) {
							if (item == null) {
								console.log("Full StatsList:"
										+ statsList.length);
								res.render('arryoutube', {
									title : new Date(),
									name : "james",
									payload : statsList
								});
							} else {
								console.log("Retrieved video : " + item._id);
								var videoId = item._id;
								var videoName = item.title;
								console.log("videoName : " + videoName);
								ratingData = [];
								numViewersData = [];
								timeData = [];
								for ( var i = 0, j = 0; i < item.stats.length
										&& j < 3; i++, j++) {
									var numViewers = item.stats[i].viewCount;
									numViewersData.push(numViewers / 1);
									var roundedRating = roundNumber(
											item.stats[i].average, 3);
									ratingData.push(roundedRating);
									timeData.push(item.stats[i].timestamp);
								}

								var stats = {
									videoId : videoId,
									videoName : videoName,
									viewsData : numViewersData,
									ratingData : ratingData,
									timeData : timeData
								};
								var statsobj = JSON.stringify(stats);
								statsList.push(statsobj);
								console.log("@@ Stats @@" + statsobj);
								console.log("#" + statsList.length);
								console.log(statsList);
							}
						});

			});
};

exports.displaystats = function(req, res) {
	getFullList(res);
	console.log("stats list : " + statsList);
	
};

/*exports.displaystats = function(req, res) {
	var videoid = req.params.videoid;
	console.log("VideoId : " + videoid);
	getListByVideoId(videoid);
	res.render('arryoutube', {
		title : 'ARR Youtube Project',
		viewsData : numViewersData,
		timeData : timeData,
		videoRatingData : ratingData,
		videoName : videoName,
		views2Data : numViewers2Data,
		time2Data : time2Data,
		videoRating2Data : rating2Data,
		video2Name  : video2Name
	});
};*/
