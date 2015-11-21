var extend = require('../util/extend'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	game_stats = require('../game/stats'),
	game_types = require('../game/types'),

	gameStatsSchema = {
		overall: game_stats
	};

Object.keys(game_types).forEach(function (game_type) {
	var _s = gameStatsSchema[game_type] = {};
	extend(_s, game_stats);
});


gameStatsSchema = new Schema(gameStatsSchema);
module.exports = gameStatsSchema;
