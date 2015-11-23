var Q = require('q'),
		mongoose =  require('mongoose'),
		playerConnectEventData = require('../fixtures/PLAYER_CONNECT');
		createConnection = function (connectionString) {
			var def = Q.defer();
			var connection = mongoose.createConnection(connectionString, function () {
				def.resolve(connection);
			});

			return def.promise;
		};

expect = require('chai').expect;

describe('When a player connects.', function () {

	var Player,
		_connection;

	before(function (done) {

		createConnection('mongodb://localhost/ql-stats-test')
				.then(require('../../index').register)
				.then(function (connection) {
					_connection = connection;
					Player = connection.model('Player');
					done()
				});
	});

	afterEach(function (done) {
		Q.all([
			Player.remove().then()
		]).then(function () {
			done();
		});
	});

	after(function (done) {
		_connection.models = {};
		_connection.modelSchemas = {};
		_connection.close();
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

