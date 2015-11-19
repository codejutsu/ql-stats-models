var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	gamestats = require('../gamestats'),

	playerStatsSchema = {
		overall: gamestats,
		duel:  gamestats,
		tdm: gamestats,
		ctf: gamestats,
		ffa: gamestats
	};

playerStatsSchema = new Schema(playerStatsSchema);
module.exports = playerStatsSchema;
