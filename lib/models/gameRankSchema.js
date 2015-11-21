var game_types = require('../game/types'),
	gameRankSchema = {
		overall: {}
	};

Object.keys(game_types).forEach(function (game_type) {
	gameRankSchema[game_type] = {};
});


module.exports = gameRankSchema;