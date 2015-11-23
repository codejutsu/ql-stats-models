var Q = require('q'),
	mongoose = require('mongoose'),
	playerStatsEventData = require('../fixtures/PLAYER_STATS.json'),
	matchStartedEventData = require('../fixtures/MATCH_STARTED.json'),
	createConnection = function (connectionString) {
		var def = Q.defer();
		var connection = mongoose.createConnection(connectionString, function () {
			def.resolve(connection);
		});

		return def.promise;
	};

expect = require('chai').expect;

describe('PLAYER_STATS - When a server has submitted a player game object.', function () {

	var _connection,
		_player,
		_playerMatchStats,
		Player,
		PlayerMatchStats,
		MatchReport,
		GlobalStats;

	before(function (done) {

		createConnection('mongodb://localhost/ql-stats-test')
			.then(require('../../index').register)
			.then(function (connection) {
				_connection = connection;
				Player = connection.model('Player');
				PlayerMatchStats = connection.model('PlayerMatchStats');
				MatchReport = connection.model('MatchReport');
				GlobalStats = connection.model('GlobalStats');


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
					done();
				});
			});
	});


	after(function (done) {

		Q.all([
			Player.remove().then(),
			MatchReport.remove().then(),
			GlobalStats.remove().then(),
			PlayerMatchStats.remove().then()
		]).then(function () {
			_connection.models = {};
			_connection.modelSchemas = {};
			_connection.close();
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
			});
	});

});

