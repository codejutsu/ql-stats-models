var Promise = require('bluebird'),
	expect = require('chai').expect,
	helper = require('../helper'),
	Player,
	steamIds = ['76561198013158463', '76561198000636434'];

describe('When using the player model.', function () {

	before(function (done) {
		function setDependencies (db) {
			Player = db.model('Player');
		}
		function createPlayer(steam_id) {
			return new Player({
				steam_id: steam_id
			}).save().then()
		}
		function setupScenario() {
			return Promise.all([
				createPlayer(steamIds[0]),
				createPlayer(steamIds[1])
			])
		}
		helper.before()
				.then(setDependencies)
				.then(setupScenario).then(function() {
			done();
		});
	});

	after(helper.after);

	it('should be able to find player by steam id', function (done) {
		Player.findBySteamId(helper.events.playerConnect.DATA.STEAM_ID).then(function (player) {
			expect(player).not.to.equal(null);
			expect(player._id).not.to.equal(null);
			done();
		});

	});

	it('should be able to find players by steam ids', function (done) {

		Player.findBySteamIds(steamIds).then(function (players) {
			expect(players).not.to.equal(null);
			expect(players.length).to.equal(2);
			done();
		});

	});
});

