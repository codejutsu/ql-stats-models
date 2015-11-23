var Q = require('q'),
	mongoose =  require('mongoose'),
	matchStartEventData = require('../fixtures/MATCH_STARTED.json'),
	createConnection = function (connectionString) {
		var def = Q.defer();
		var connection = mongoose.createConnection(connectionString, function () {
			def.resolve(connection);
		});

		return def.promise;
	};

expect = require('chai').expect;


describe('MATCH_STARTED - When match has started.', function () {
	var _connection,
		_matchReport,
		Player,
		MatchReport,
		PlayerMatchStats;

	before(function (done) {

		createConnection('mongodb://localhost/ql-stats-test')
				.then(require('../../index').register)
				.then(function (connection) {
					_connection = connection;
					Player = connection.model('Player');
					MatchReport = connection.model('MatchReport');
					PlayerMatchStats = connection.model('PlayerMatchStats');
					done();
				});
	});

	afterEach(function (done) {
		Q.all([
			Player.remove().then(),
			MatchReport.remove().then(),
			PlayerMatchStats.remove().then()
		]).then(function () {
			done();
		});
	});

	after(function (done) {
		_connection.models = {};
		_connection.modelSchemas = {};
		_connection.close();
		done();
	});

	it('should create a match report', function (done) {

		MatchReport.createFrom(matchStartEventData).then(function (document) {
			expect(document._id).to.not.equal(null);
			_matchReport = document;
			done();
		});

	});

	describe('then', function () {
		var steamIds = matchStartEventData.DATA.PLAYERS.map(function (p) {
			if (p.TEAM !== 3)
				return p.STEAM_ID;
		});

		before(function () {
			var defereds = [
				Player.remove().then(),
				MatchReport.createFrom(matchStartEventData).then()
			];

			steamIds.forEach(function (id) {
				defereds.push(new Player({
					steam_id: id
				}).save().then());
			});

			Q.all(defereds).then(function () {
				done();
			});

		});

		it('should be able to add players to a match report', function (done) {
			Q.all([
				Player.findBySteamIds(steamIds).then(),
				MatchReport.findByGuid(matchStartEventData.DATA.MATCH_GUID).then()
			]).then(function (results) {
				var players = results[0],
					matchReport = results[1];

				matchReport.addPlayers(players).then(function (result) {
					expect(result.ok).to.equal(1);
					done();
				});

			})

		});

	});



});

