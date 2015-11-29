var Promise = require('bluebird'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports = function (db) {

	var GlobalStats,
		globalStatsSchema = {
			game_stats: {
				overall:{type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
				ad: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
				ca: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
				dom: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
				duel: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
				ffa: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
				race: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
				rr: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
				tdm: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'}
			}
		};


	globalStatsSchema = new Schema(globalStatsSchema);

	globalStatsSchema.statics.get = function (type) {

		GlobalStats.findOne().where('game-stats.' + type)

	};

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

		return GlobalStats.findOne()
			.exec()
			.then(function (globalStats) {
				return Promise.all([
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

		return Promise.all([
			this.update(overallQuery).exec(),
			this.update(game_typeQuery).exec()
		]);
	};

	globalStatsSchema.post('init', function(doc) {
		// TODO: See if I can make sure that the collection has one document using this event (precedes all user queries).
		console.log('%s has been initialized from the db', doc._id);
	});


	GlobalStats = db.model('GlobalStats', globalStatsSchema);


	return GlobalStats;

};

