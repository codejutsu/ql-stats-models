var Q = require('q'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	gamestats = require('../gamestats'),
	Player = require('./Player'),
	MatchReport = require('./MatchReport'),
	schemaBase = {
		player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
		match: {type: mongoose.Schema.Types.ObjectId, ref: 'MatchReport'},
		aborted: Boolean,
		match_guid: String,
		steam_id: String,
		nick: String,
		warmup: Number,
		// Rank
		rank: Number,
		team_rank: Number,
		tied_rank: Number,
		tied_team_rank: Number,
		gamestats: gamestats
	};

var playerMatchStatsSchema = new Schema(schemaBase);

playerMatchStatsSchema.statics.createFrom = function (event) {
	var def = Q.defer(),
		onFail = function (err) {
			def.reject(err);
		};

	console.log(event.DATA.MATCH_GUID);
	Q.all([
		Player.findBySteamId(event.DATA.STEAM_ID).then(),
		MatchReport.findByGuid(event.DATA.MATCH_GUID).then()
	]).then(function (player, match) {

		new MatchReport({
			player: player,
			match: match
		}).save().then(function (playerMatchStats) {
			console.log('playerMatchStats:', playerMatchStats);
			def.resolve(playerMatchStats);
		})
	});

	return def.promise;
};

var PlayerMatchStats = mongoose.model('PlayerMatchStats', playerMatchStatsSchema);
module.exports = PlayerMatchStats;

