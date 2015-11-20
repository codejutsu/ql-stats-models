var Q = require('q'),
	mongoose =  require('mongoose'),
	models = require('../../index'),
	Player = models.Player,
	playerDisconnectEventData = require('../fixtures/PLAYER_DISCONNECT');

expect = require('chai').expect;

describe('When a player disconnects.', function () {

	before(function () {
		mongoose.connect('mongodb://localhost/ql-gamestats-test');
	});

	afterEach(function (done) {
		Q.all([
			Player.remove().then()
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


	it('should be able to update last seen', function (done) {
		Player.updateLastSeen(playerDisconnectEventData).then(function (err) {
			expect(err).to.equal(null);
			done();
		});
	});


});

