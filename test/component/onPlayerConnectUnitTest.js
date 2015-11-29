var Promise = require('bluebird'),
		expect = require('chai').expect,
		helper = require('../helper'),
		Player,
		steamIds = ['76561198013158463', '76561198000636434'];

// createOrUpdate
// update last seen

describe('When using the player model.', function () {

	before(function (done) {
		function setDependencies (db) {
			Player = db.model('Player');
		}
		function setupScenario() {
			return Promise.all([
			])
		}
		helper.before()
				.then(setDependencies)
				.then(setupScenario).then(function() {
			done();
		});
	});

	after(helper.after);

	it('should be able to find or create a user', function (done) {

		Player.findOrCreateUser(helper.events.playerConnect)
				.then(function (player) {
					_player = player;
					expect(player).to.not.equal(null);
					done();
				});
	});

	it('should be able to update last seen', function (done) {

		Player.findOrCreateUser(helper.events.playerConnect)
				.then(function () {
					Player.updateLastSeen(helper.events.playerConnect)
							.then(function (result) {
								expect(result.ok).to.equal(1);
								done();
							});
				});
	});
});