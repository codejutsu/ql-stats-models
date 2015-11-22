var Q = require('q'),
	mongoose =  require('mongoose'),
	models = require('../../index'),
	Player = models.Player,
	PlayerMatchStats = models.PlayerMatchStats,
	MatchReport = models.MatchReport,
	matchStartedEventData = require('../fixtures/MATCH_STARTED.json'),
	matchReportEventData = require('../fixtures/MATCH_REPORT'),
	_playerMatchStats = [];

expect = require('chai').expect;


describe('When a match report has been submitted.', function () {

	before(function (done) {
		mongoose.connect('mongodb://localhost/ql-stats-models-test');

		Q.all([
			new Player({steam_id:'76561198013158463'}).save(),
			new Player({steam_id:'76561198000636434'}).save(),
			new PlayerMatchStats({ steam_id: '76561198013158463', game_stats: { win: 1} }).save(),
			new PlayerMatchStats({ steam_id: '76561198000636434', game_stats: { lose: 1} }).save(),
			MatchReport.createFrom(matchStartedEventData).then()
		]).then(function (results) {
			_playerMatchStats.push(results[2]);
			_playerMatchStats.push(results[3]);
			done();
		})

	});

	after(function (done) {
		Q.all([
			Player.remove().then(),
			PlayerMatchStats.remove().then(),
			MatchReport.remove().then()
		]).then(function () {
			mongoose.models = {};
			mongoose.modelSchemas = {};
			mongoose.disconnect();
			done();
		})
	});

	it('should be able to create or update the match report with match report data', function (done) {

		MatchReport.updateWith(matchReportEventData).then(function (result) {
			expect(result.ok).to.equal(1);
			done();
		});

	});

	it('should store all player reports on match report document', function (done) {

		MatchReport.findByGuid(matchReportEventData.DATA.MATCH_GUID).then(function (match) {
			match.addPlayerMatchStats(_playerMatchStats).then(function (result) {
				expect(result.ok).to.equal(1);
				done();
			});
		})


	});
});

