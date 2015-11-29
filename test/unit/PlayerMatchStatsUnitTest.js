var Promise = require('bluebird'),
	expect = require('chai').expect,
	helper = require('../helper'),
	PlayerMatchStats,
	MatchReport,
	Player;

describe('When using the PlayerMatchStats and "MATCH_STARTED" event json data.', function () {

	before(function (done) {
		function setDependencies (db) {
			PlayerMatchStats = db.model('PlayerMatchStats');
			MatchReport = db.model('MatchReport');
			Player = db.model('Player');
		}
		function createMatchReport() {
			return new MatchReport({
				match_guid: helper.events.matchStarted.DATA.MATCH_GUID,
				game_type: 'duel'
			}).save().then()
		}
		function createPlayerA() {
			return new Player({
				steam_id: helper.events.playerStats.DATA.STEAM_ID
			}).save().then()
		}
		function createPlayerB() {
			return new Player({
				steam_id: helper.events.playerStats2.DATA.STEAM_ID
			}).save().then();
		}
		function setupScenario() {
			return Promise.all([
				createMatchReport(),
				createPlayerA(),
				createPlayerB()
			])
		}
		helper.before()
			.then(setDependencies)
			.then(setupScenario).then(function() {
				done();
			}, function (err) {
			console.log(err);
		});
	});

	after(helper.after);


	function evaluatePlayerMatchStats(playerMatchStats) {
		expect(playerMatchStats.length).to.equal(2);
		expect(playerMatchStats[0].match_guid).to.equal(helper.events.matchStarted.DATA.MATCH_GUID);
		expect(playerMatchStats[1].match_guid).to.equal(helper.events.matchStarted.DATA.MATCH_GUID);
	}

	it('should be able to create player match stats with match started event data', function (done) {
		PlayerMatchStats.createWithMatchStarted(helper.events.matchStarted)
			.then(evaluatePlayerMatchStats)
			.then(done);
	});
});