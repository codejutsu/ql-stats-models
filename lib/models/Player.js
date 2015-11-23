var Q = require('q'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports = function (connection) {

	var Player,
		playerSchema = new Schema({
			steam_id: String,
			profile: {
				steam: {}
			},
			last_seen: Date,
			game_stats: require('./gameStatsSchema'),
			game_rank: require('./gameRankSchema.js')
		});


	playerSchema.statics.updateLastSeen = function (gameEventData) {

		var updateLastSeen = {
			$set: {
				last_seen: new Date().toUTCString()
			}
		};

		return this.where('steam_id', gameEventData.DATA.STEAM_ID)
			.update(updateLastSeen)
			.exec();
	};

	playerSchema.statics.addMatch = function (steamid, matchid) {
		return this.where('steam_id', steamid)
			.findOne()
			.exec()
			.then(function (player) {
				player.matches.push(matchid);
				return player.save();
			});

	};

	playerSchema.statics.findBySteamId = function (steamId) {
		if (!steamId)
			throw new Error("Missing steamId argument");
		return Player.findOne()
			.where('steam_id', steamId)
			.exec();
	};

	playerSchema.statics.findBySteamIds = function (steamIds) {
		if (!steamIds)
			throw new Error("Missing steamIds argument");

		return Player.find()
			.where('steam_id')
			.in(steamIds)
			.exec();
	};

	playerSchema.methods.updateStatsWith = function (playerMatchStats) {

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

	playerSchema.statics.findOrCreateUser = function (gameEventData) {

		var createIfPlayerDontExist = function (player) {
			if (player) {
				return Q.fcall(function () {
					return player;
				});
			}

			return new Player({
					steam_id: gameEventData.DATA.STEAM_ID,
					game_stats: {}
				})
				.save();

		};

		return this.where('steam_id', gameEventData.DATA.STEAM_ID)
			.findOne()
			.exec()
			.then(createIfPlayerDontExist)
	};

	Player = connection.model('Player', playerSchema);
	return Player;
};