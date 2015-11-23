var	Q = require('q'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	gameStatsSchema = require('../schemas/game/game-stats-schema');

module.exports = function (connection) {

	var GlobalStats,
		globalStatsSchema = {
			game_stats: new Schema(gameStatsSchema)
		};


	globalStatsSchema = new Schema(globalStatsSchema);

	globalStatsSchema.statics.updateWith = function (playerMatchStats) {
		var game_stats = playerMatchStats.game_stats.toObject(),
				overallQuery = {
					$inc: require('../util/game-stats-keys')
							.buildIncrementQuery('overall', game_stats)
				},
				game_typeQuery = {
					$inc: require('../util/game-stats-keys')
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
					$inc: require('../util/game-stats-keys')
							.buildIncrementQuery('overall', game_stats)
				},
				game_typeQuery = {
					$inc: require('../util/game-stats-keys')
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

