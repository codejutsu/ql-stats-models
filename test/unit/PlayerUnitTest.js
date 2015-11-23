var Q = require('q'),
	mongoose = require('mongoose'),
	playerConnectEventData = require('../fixtures/PLAYER_CONNECT'),
	playerStatsEventData = require('../fixtures/PLAYER_STATS'),
	steamIds = ['76561198013158463', '76561198000636434'],
	createConnection = function (connectionString) {
		var def = Q.defer();
		var connection = mongoose.createConnection(connectionString, function () {
			def.resolve(connection);
		});

		return def.promise;
	},
	expect = require('chai').expect;


describe('When using the Player model.', function () {

	var Player,
		_connection;

	before(function (done) {

		createConnection('mongodb://localhost/ql-stats-test')
			.then(require('../../index').register)
			.then(function (connection) {
				_connection = connection;
				Player = connection.model('Player');

				Q.all([
						new Player({steam_id: steamIds[0]}).save().then(),
						new Player({steam_id: steamIds[1]}).save().then()
					])
					.then(function () {
						done();
					}, function (err) {
						console.error(err);
					});

			});
	});


	after(function (done) {
		Q.all([
			Player.remove().then()
		]).then(function () {
			_connection.models = {};
			_connection.modelSchemas = {};
			_connection.close();
			done();
		});

	});

	it('should be able to find player by steam id', function (done) {

		Player.findBySteamId(playerConnectEventData.DATA.STEAM_ID).then(function (player) {
			expect(player).not.to.equal(null);
			expect(player._id).not.to.equal(null);
			done();
		});

	});

	it('should be able to find players by steam ids', function (done) {

		Player.findBySteamIds(steamIds).then(function (players) {
			expect(players).not.to.equal(null);
			expect(players[0].steam_id).to.equal(steamIds[0]);
			expect(players[1].steam_id).to.equal(steamIds[1]);
			done();
		});

	});


});

