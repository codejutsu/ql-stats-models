var Q = require('q'),
		mongoose =  require('mongoose'),
		models = require('../../index'),
		Player = models.Player,
		playerConnectEventData = require('../fixtures/PLAYER_CONNECT');

expect = require('chai').expect;

describe('When a player connects.', function () {

	before(function () {
		mongoose.connect('mongodb://localhost/ql-game-test');
	});

	afterEach(function (done) {
		Q.all([
			Player.remove().then()
		]).then(function () {
			done();
		});
	});

	after(function (done) {
		// NOTE: Please don't forget to clean out all collections you used.
		mongoose.models = {};
		mongoose.modelSchemas = {};
		mongoose.disconnect();
		done();
	});


	it('should be able to find or create a user', function (done) {

		Player.findOrCreateUser(playerConnectEventData)
				.then(function (player) {
					expect(player).to.not.equal(null);
					done();
				});
	});

	it('should be able to update last seen', function (done) {

		// TODO: Fix this broken logic.
		Player.findOrCreateUser(playerConnectEventData)
				.then(function (player) {
					Player.updateLastSeen(playerConnectEventData)
							.then(function (result) {
								expect(result.ok).to.equal(1);
								done();
							});
				});


	});





});

