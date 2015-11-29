var Promise = require('bluebird'),
	expect = require('chai').expect,
	helper = require('../helper'),
	Player;

// update player last seen

describe('When a player disconnects.', function () {

	before(function (done) {
		function setDependencies (db) {
			Player = db.model('Player');
		}

		function setupScenario () {
			return Promise.all([
				createPlayer().then()
			])
		}

		function createPlayer () {
			return new Player({steam_id: helper.events.playerDisconnect.DATA.STEAM_ID}).save().then();
		}

		helper.before()
			.then(setDependencies)
			.then(setupScenario).then(function () {
			done();
		});
	});

	after(helper.after);


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

	it('should be able to recover from missing players', function () {

	});
});

