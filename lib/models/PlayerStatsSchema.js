var mongoose = require('mongoose'),
	extend = require('../util/extend'),
	Schema = mongoose.Schema,
	game_stats = require('../game/stats'),
	game_types = require('../game/types'),

	playerStatsSchema = {
		overall: game_stats,
		player: {}
	};

Object.keys(game_types).forEach(function (game_type) {
	var _s = playerStatsSchema[game_type] = {};
	extend(_s, game_stats);
});


module.exports = new Schema(playerStatsSchema);
