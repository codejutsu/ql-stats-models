var Q = require('q'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	game_stats = require('../game/stats'),
	playerStatsSchema = require('./PlayerStatsSchema'),
	MatchReport,
	matchReportSchema = new Schema({

		// match started
		capture_limit: Number,
		factory: String,
		factory_title: String,
		fraglimit: Number,
		game_type: String,
		infected: Number,
		instagib: Number,
		map: String,
		guid: String,
		mercy_limit: Number,
		quadhog: Number,
		score_limit: Number,
		server_title: String,
		timelimit: Number,
		training: Number,
		owner_steamid: String,

		// match completed
		aborted: Boolean,
		exit_msg: String,
		game_length: Number,
		last_lead_change_time: Number,
		last_scorer: String,
		last_team_scorer: String,
		restarted: Number,
		tscore0: Number,
		tscore1: Number,


		players: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
		player_game_stats: [game_stats]

	});

matchReportSchema.statics.createFrom = function (matchStartedEvent) {

	var Player = mongoose.model('Player'),
		filterSpectators = function (p) {
			return p.TEAM !== 3;
		},
		mapBySteamId = function (p) {
			return p.STEAM_ID;
		},
		steamIds = matchStartedEvent.DATA.PLAYERS.filter(filterSpectators).map(mapBySteamId);


	return Player.findBySteamIds(steamIds).then(function (players) {
		var matchReport = new MatchReport({
			capture_limit: matchStartedEvent.DATA.CAPTURE_LIMIT,
			factory: matchStartedEvent.DATA.FACTORY,
			factory_title: matchStartedEvent.DATA.FACTORY_TITLE,
			fraglimit: matchStartedEvent.DATA.FRAG_LIMIT,
			game_type: matchStartedEvent.DATA.GAME_TYPE,
			infected: matchStartedEvent.DATA.INFECTED,
			instagib: matchStartedEvent.DATA.INSTAGIB,
			map: matchStartedEvent.DATA.MAP,
			guid: matchStartedEvent.DATA.MATCH_GUID,
			mercy_limit: matchStartedEvent.DATA.MERCY_LIMIT,
			quadhog: matchStartedEvent.DATA.QUADHOG,
			score_limit: matchStartedEvent.DATA.SCORE_LIMIT,
			server_title: matchStartedEvent.DATA.SERVER_TITLE,
			timelimit: matchStartedEvent.DATA.TIME_LIMIT,
			training: matchStartedEvent.DATA.TRAINING,
			owner_steamid: (matchStartedEvent.SERVER && matchStartedEvent.SERVER.OWNER_STEAM_ID) || '',
			players: players.map(function (p) {
				return p._id;
			})
		});

		return matchReport.save();
	});

};

matchReportSchema.statics.updateWith = function (matchReportEvent) {

	return MatchReport.findByGuid(matchReportEvent.DATA.MATCH_GUID).then(function (matchReport) {

		if (!matchReport) return Q.fcall(function () {
			return null
		});

		var update = {
				aborted: matchReportEvent.DATA.ABORTED,
				exit_msg: matchReportEvent.DATA.EXIT_MSG,
				game_length: matchReportEvent.DATA.GAME_LENGTH,
				last_lead_change_time: matchReportEvent.DATA.LAST_LEAD_CHANGE_TIME,
				last_scorer: matchReportEvent.DATA.LAST_SCORER,
				last_team_scorer: matchReportEvent.DATA.LAST_TEAMSCORER,
				restarted: matchReportEvent.DATA.RESTARTED,
				tscore0: matchReportEvent.DATA.TSCORE0,
				tscore1: matchReportEvent.DATA.TSCORE1
			};


		return matchReport.update(update).exec();

	})
};

matchReportSchema.statics.findByGuid = function (guid) {
	return MatchReport.findOne()
		.where('guid', guid)
		.exec();
};

matchReportSchema.methods.addPlayers = function (players) {

	var update = {
		players: players.map(function (p) {
			return p._id;
		})
	};

	return this.update(update).exec();
};

matchReportSchema.methods.addPlayerMatchStats = function (playerMatchStats) {

	var update = {
		player_game_stats: playerMatchStats.map(function (playerMatch) {
			return playerMatch.game_stats;
		})
	};

	return this.update(update).exec();
};



matchReportSchema.pre('save', function (next) {
	this.game_type = this.game_type.toLowerCase();
	next();
});

module.exports = MatchReport = mongoose.model('MatchReport', matchReportSchema);
