var Q = require('q'),
	mongoose =  require('mongoose'),
	models = require('../../index'),
	Player = models.Player,
	MatchReport = models.MatchReport,
	PlayerMatchStats = models.PlayerMatchStats,
	matchStartEventData = require('../fixtures/MATCH_STARTED.json');

expect = require('chai').expect;


describe('MATCH_STARTED - When match has started.', function () {
	var matchReport;

	before(function (done) {
		mongoose.connect('mongodb://localhost/ql-stats-models-test');
		Q.all([
			Player.remove().then(),
			MatchReport.remove().then(),
			PlayerMatchStats.remove().then()
		]).then(function () {
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
		mongoose.models = {};
		mongoose.modelSchemas = {};
		mongoose.disconnect();
		done();
	});

	it('should create a match report', function (done) {

		MatchReport.createFrom(matchStartEventData).then(function (document) {
			expect(document._id).to.not.equal(null);
			matchReport = document;
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

