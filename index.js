var Promise = require('bluebird'),
	mongoose = require('mongoose');

module.exports = {
	register: function (connection) {
		return new Promise(function (resolve, reject) {
			require('./lib/models')(connection);
			resolve(connection);
		})
	},
	createConnection: function (connectionString) {
		return new Promise(function (resolve, reject) {
			var connection = mongoose.createConnection(connectionString, function () {
				resolve(connection);
			});
		});
	}
};