/**
 * New node file
 */

exports.info = function(req, res) {
	var state = req.query.state;
	console.log('State: ' + state);
	res.send({'longurl':state}, 200);
};
