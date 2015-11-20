var Q = require('q'),
		mongoose =  require('mongoose'),
		models = require('../../index'),
		Player = models.Player,
		PlayerMatchStats = models.PlayerMatchStats,
		MatchReport = models.MatchReport,
		playerStatsEventData = require('../fixtures/PLAYER_STATS.json');

expect = require('chai').expect;

describe('When a server has submitted a player gamestats object.', function () {

	before(function (done) {
		mongoose.connect('mongodb://localhost/ql-gamestats-test');
		Q.all([
			new MatchReport({
				guid: playerStatsEventData.DATA.MATCH_GUID
			}).save().then(),
			Player.findOrCreateUser(playerStatsEventData).then()
		]).then(function (matchreport, player) {
			expect(matchreport).not.to.equal(null);
			expect(player).not.to.equal(null);
			done();
		});

	});

	after(function (done) {
		Q.all([
			Player.remove().then(),
			MatchReport.remove().then()
		]).then(function () {
			mongoose.models = {};
			mongoose.modelSchemas = {};
			mongoose.disconnect();
			done();
		});

	});


	it('should be to create player match stats', function (done) {
		PlayerMatchStats.createFrom(playerStatsEventData).then(function (playerMatchStats) {
			console.log(playerMatchStats);
			done();
		});
	});

	it('should be able to update player global stats', function () {
		// Player;
	});

	it('should be able to update player game mode stats', function () {
		// Player.updateStatsByGameMode(data, stats)
	});


});

