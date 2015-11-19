var Q = require('q'),
	mongoose =  require('mongoose'),
    models = require('../../index'),
    Player = models.Player,
    MatchReport = models.MatchReport,
    PlayerMatchStats = models.PlayerMatchStats,
	matchStartEventData = require('../fixtures/MATCH_STARTED.json');

expect = require('chai').expect;

describe('When match has started.', function () {
	var matchReport;

    before(function () {
        mongoose.connect('mongodb://localhost/ql-gamestats-test');
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

    after(function () {
        // NOTE: Please don't forget to clean out all collections you used.
        mongoose.models = {};
        mongoose.modelSchemas = {};
        mongoose.disconnect();
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
			var deferreds = [
				Player.remove().then(),
				MatchReport.createFrom(matchStartEventData).then()
			];

			steamIds.forEach(function (id) {
				deferreds.push(new Player({
					steam_id: id
				}).save().then());
			});

			Q.all(deferreds).then(function () {
				done();
			});

		});

		it('should associate players with match (exclude spectators)', function (done) {
			Player.findBySteamIDs(steamIds)
				.then(function (players) {
					MatchReport.findByGuid(matchStartEventData.DATA.MATCH_GUID).then(function (report) {

						report.players = players.map(function (p) {
							return p._id;
						});

						report.save().then(function (doc) {
							expect(doc.players.length).to.equal(3);
							done();
						});

					});
				});
		});

	});



});

