var Q = require('q'),
	mongoose = require('mongoose'),
	models = require('../../index'),
	Player = models.Player,
	PlayerMatchStats = models.PlayerMatchStats,
	MatchReport = models.MatchReport,
	GlobalStats = models.GlobalStats,
	playerStatsEventData = require('../fixtures/PLAYER_STATS.json');
	matchStartedEventData = require('../fixtures/MATCH_STARTED.json');

expect = require('chai').expect;

describe('When a server has submitted a player game object.', function () {

	var _player,
		_playerMatchStats;

	before(function (done) {
		mongoose.connect('mongodb://localhost/ql-stats-test');
		Q.all([
			MatchReport.createFrom(matchStartedEventData).then(),
			Player.findOrCreateUser(playerStatsEventData).then(),
			new GlobalStats({
				game_stats: {
					overall: {},
					duel: {}
				}
			}).save()
		]).then(function (results) {
			_player = results[1];
			_globalStats = results[2];
			expect(results[0]).not.to.equal(null);
			expect(results[1]).not.to.equal(null);
			expect(results[2]).not.to.equal(null);
			done();
		});
	});

	after(function (done) {
		Q.all([
			Player.remove().then(),
			MatchReport.remove().then(),
			GlobalStats.remove().then()
		]).then(function () {
			mongoose.models = {};
			mongoose.modelSchemas = {};
			mongoose.disconnect();
			done();
		});

	});


	it('should be to create player match stats', function (done) {
		PlayerMatchStats.createFrom(playerStatsEventData)
			.then(function (playerMatchStats) {
				_playerMatchStats = playerMatchStats;
				expect(playerMatchStats._id).not.to.equal(null);
				done();
			})
	});

	it('should be able to update player overall and game type with match stats', function (done) {
		_player.updateStatsWith(_playerMatchStats)
				.then(function (status) {
					expect(status[0].ok).to.equal(1);
					expect(status[1].ok).to.equal(1);
					done();
				});
	});

	it('should be able to update global overall and game type with match stats', function (done) {

		GlobalStats.updateWith(_playerMatchStats)
				.then(function (status) {
					expect(status[0].ok).to.equal(1);
					expect(status[1].ok).to.equal(1);
					done();
				}, function (err) {
					console.error(err);
					done();
				});
	});

});

