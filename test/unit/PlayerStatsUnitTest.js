var Q = require('q'),
		mongoose =  require('mongoose'),
		models = require('../../index'),
		Player = models.Player,
		MatchReport = models.MatchReport,
		playerStatsEventData = require('../fixtures/PLAYER_STATS.json');

expect = require('chai').expect;

describe('When a server has submitted a player gamestats object.', function () {

	before(function () {
		mongoose.connect('mongodb://localhost/ql-gamestats-test');
	});

	afterEach(function (done) {
		Q.all([
			Player.remove().then(),
			MatchReport.remove().then()
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


	it('should be to create player match gamestats', function (done) {
		//PlayerMatchStats();
	});

	it('should be able to update player global counters', function (done) {
		// PlayerStats;
	});


});

