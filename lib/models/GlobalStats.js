var	Q = require('q'),
	extend = require('../util/extend'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports = function (connection) {
	var GlobalStats,
		game_stats = require('../game/stats'),
		game_types = require('../game/types'),
		globalStatsSchema = {
			game_stats: {
				overall: game_stats
			}
		};

	Object.keys(game_types).forEach(function (game_type) {
		var _s = globalStatsSchema.game_stats[game_type] = {};
		extend(_s, game_stats);
	});

	globalStatsSchema = new Schema(globalStatsSchema);

	globalStatsSchema.statics.updateWith = function (playerMatchStats) {
		var game_stats = playerMatchStats.game_stats.toObject(),
				overallQuery = {
					$inc: require('../game/keys/gameStatsKeys')
							.buildIncrementQuery('overall', game_stats)
				},
				game_typeQuery = {
					$inc: require('../game/keys/gameStatsKeys')
							.buildIncrementQuery(playerMatchStats.game_type, game_stats)
				};

		return GlobalStats.findOne().exec().then(function (globalStats) {
			return Q.all([
				globalStats.update(overallQuery).exec(),
				globalStats.update(game_typeQuery).exec()
			]);
		});
	};

	globalStatsSchema.methods.updateStatsWith = function (playerMatchStats) {

		var game_stats = playerMatchStats.game_stats.toObject(),
				overallQuery = {
					$inc: require('../game/keys/gameStatsKeys')
							.buildIncrementQuery('overall', game_stats)
				},
				game_typeQuery = {
					$inc: require('../game/keys/gameStatsKeys')
							.buildIncrementQuery(playerMatchStats.game_type, game_stats)
				};

		return Q.all([
			this.update(overallQuery).exec(),
			this.update(game_typeQuery).exec()
		]);
	};

	GlobalStats = connection.model('GlobalStats', globalStatsSchema);

	return GlobalStats;

};