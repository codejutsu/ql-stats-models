var Q = require('q'),
	mongoose =  require('mongoose'),
	models = require('../../index'),
	Player = models.Player,
	PlayerMatchStats = models.PlayerMatchStats,
	MatchReport = models.MatchReport,
	matchReportEventData = require('../fixtures/MATCH_REPORT');

expect = require('chai').expect;

describe('When a match report has been submitted.', function () {

	before(function () {
		mongoose.connect('mongodb://localhost/ql-game-test');
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

	it('should be able to create or update the match report with match report data', function () {

	});

	it('should store all player reports on match report document', function () {

	});
});

