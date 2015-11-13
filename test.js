var mongoose =  require('mongoose'),
	models = require('./index'),
	Player = models.Player;

mongoose.connect('mongodb://localhost/qltest');

var player = new Player({
	profile: {
		steam_id: 'apa'
	}
});
console.log('testing');

player.save(function (err) {
	console.log('dat player');

	Player.find(function (err, docs) {
		console.log(docs);
		Player.remove();
	});
});