/**
 * Main Page for ARR Youtube
 */

exports.displaystats = function(req, res) {
	var videoid = req.query.videoid;
	console.log('Video ID: ' + videoid);
	
	//Stats for videoId
	var ratingData = [4, 5, 4, 4.5, 5];
	var videoName = "Theera";
	
	res.render('arryoutube', {
		title : 'ARR Youtube Project',
		videoRatingData : ratingData,
		videoName : videoName
	});
};
