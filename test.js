var mongoose = require('mongoose'),
	models = require('./index');
mongoose.connect('mongodb://localhost/ql-gamestats-model-v0-0-1');

//console.log(models);

Object.keys(models['Player'].schema.paths).forEach(function(key) {
	console.log(key);
});


var playerConnect = require('./test/fixtures/PLAYER_CONNECT');
console.log(playerConnect);

models.Player.findOrCreateUser(playerConnect).then(function (player) {
	if (player)
		console.log('successfull');

	models.Player.updateLastSeen(player.profile.steam.id).then(function (err) {
		console.log('updated', err);
	});
});