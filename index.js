var Q = require('q'),
	mongoose = require('mongoose');

module.exports = {
	register: function (connection) {
		return Q.try(function () {
			require('./lib/models')(connection);
			return connection;
		});
	},
	createConnection: function (connectionString) {
		var d = Q.defer();
		var connection = mongoose.createConnection(connectionString, function () {
			d.resolve(connection);
		});
		return d.promise;
	}
};