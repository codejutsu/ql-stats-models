var Q = require('q'),
	mongoose =  require('mongoose'),
	playerDisconnectEventData = require('../fixtures/PLAYER_DISCONNECT'),
	createConnection = function (connectionString) {
		var def = Q.defer();
		var connection = mongoose.createConnection(connectionString, function () {
			def.resolve(connection);
		});

		return def.promise;
	};

expect = require('chai').expect;

describe('When a player disconnects.', function () {
	var _connection,
		Player;

	before(function (done) {

		createConnection('mongodb://localhost/ql-stats-test')
				.then(require('../../index').register)
				.then(function (connection) {
					_connection = connection;
					Player = connection.model('Player');
					new Player({steam_id: playerDisconnectEventData.DATA.STEAM_ID}).save().then(function () {
						done();
					})

				});
	});


	after(function (done) {
		Q.all([
			Player.remove().then()
		]).then(function () {
			_connection.close();
			done();
		});
	});


	it('should be able to update last seen', function (done) {
		Player.updateLastSeen(playerDisconnectEventData).then(function (result) {
			expect(result.ok).to.equal(1);
			done();
		});
	});


});

